const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * Process receipt image with OCR
 * POST /api/ocr/process-receipt
 * Requires JWT authentication
 */
router.post('/process-receipt', upload.single('file'), async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log('OCR request received:', {
      user_id,
      hasFile: !!req.file,
      fileInfo: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
        'authorization': req.headers['authorization'] ? 'Bearer [REDACTED]' : 'None'
      }
    });

    // Check if file was uploaded
    if (!req.file) {
      console.log('No file found in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Validate file size
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 10MB allowed.'
      });
    }

    // Create form data for OCR API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call OCR API
    const ocrResponse = await axios.post(
      'https://ocrdataparser-production.up.railway.app/process-receipt/',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    // Check if OCR was successful
    if (!ocrResponse.data) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process image with OCR service'
      });
    }

    const ocrData = ocrResponse.data;

    // Validate OCR response structure
    if (!ocrData.amount || !ocrData.date || !ocrData.category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OCR response format',
        data: ocrData
      });
    }

    // Create expense object from OCR data
    const expenseData = {
      user_id,
      amount: parseFloat(ocrData.amount) || 0,
      category: ocrData.category || 'Other',
      subcategory: ocrData.subcategory || null,
      companions: Array.isArray(ocrData.companions) ? ocrData.companions : [],
      date: new Date(ocrData.date) || new Date(),
      paymentMethod: ocrData.paymentMethod || 'unknown',
      description: ocrData.description || 'Receipt scan'
    };

    // Create the expense in database
    const expense = await prisma.expense.create({
      data: expenseData,
      select: {
        id: true,
        amount: true,
        category: true,
        subcategory: true,
        companions: true,
        date: true,
        paymentMethod: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    // Create a message record for this expense
    const message = await prisma.message.create({
      data: {
        user_id,
        content: `Receipt scanned: ₹${expense.amount} for ${expense.category}${expense.description ? ` - ${expense.description}` : ''}`,
        sender: 'user',
        source: 'web',
        expenseId: expense.id
      }
    });

    // Return the processed data
    res.json({
      success: true,
      message: 'Receipt processed successfully',
      data: {
        ocrData: ocrData,
        expense: expense,
        message: {
          id: message.id,
          content: message.content,
          sender: message.sender,
          createdAt: message.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error processing receipt:', error);

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 10MB allowed.'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please use "file" as the field name.'
      });
    }

    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed.'
      });
    }

    if (error.response && error.response.status === 413) {
      return res.status(400).json({
        success: false,
        message: 'File too large for processing.'
      });
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        message: 'OCR processing timeout. Please try again with a smaller image.'
      });
    }

    if (error.response && error.response.status >= 500) {
      return res.status(503).json({
        success: false,
        message: 'OCR service is temporarily unavailable. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Failed to process receipt image'
    });
  }
});

/**
 * Get OCR processing history for user
 * GET /api/ocr/history
 * Requires JWT authentication
 */
router.get('/history', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get expenses created from OCR (identified by paymentMethod or description)
    const ocrExpenses = await prisma.expense.findMany({
      where: {
        user_id,
        OR: [
          { description: { contains: 'Receipt scan' } },
          { paymentMethod: { not: 'upi' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        amount: true,
        category: true,
        subcategory: true,
        companions: true,
        date: true,
        paymentMethod: true,
        description: true,
        createdAt: true,
        messages: {
          select: {
            id: true,
            content: true,
            sender: true,
            createdAt: true
          }
        }
      }
    });

    // Get total count
    const totalCount = await prisma.expense.count({
      where: {
        user_id,
        OR: [
          { description: { contains: 'Receipt scan' } },
          { paymentMethod: { not: 'upi' } }
        ]
      }
    });

    res.json({
      success: true,
      data: {
        expenses: ocrExpenses,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error getting OCR history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
