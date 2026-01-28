import express from 'express';
const { PrismaClient } = require('../../generated/prisma');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Create expense from payment form
 * POST /api/expenses/payment
 * Requires JWT authentication
 */
router.post('/payment', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { amount, description } = req.body;

    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Create expense object based on schema
    const expenseData = {
      user_id,
      amount: parseFloat(amount),
      category: description.trim(), // Using description as category
      subcategory: null, // Empty as requested
      companions: [], // Empty array as requested
      date: new Date(), // Current date/time
      paymentMethod: 'upi', // Always UPI for UPI payments
      description: description.trim()
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

    // Also create a message record for this expense
    const message = await prisma.message.create({
      data: {
        user_id,
        content: `Payment of ₹${amount} made via UPI for ${description}`,
        sender: 'user',
        source: 'web',
        expenseId: expense.id
      }
    });

    // Return the expense data as JSON
    res.json({
      success: true,
      message: 'Expense created successfully',
      data: {
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
    console.error('Error creating expense from payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get all expenses for a user
 * GET /api/expenses
 * Requires JWT authentication
 */
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { limit = 50, offset = 0, category, paymentMethod } = req.query;

    // Build where clause
    const where = { user_id };
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    // Get expenses for user
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
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
        createdAt: true
      }
    });

    // Get total count
    const totalCount = await prisma.expense.count({
      where
    });

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error getting expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get expense by ID
 * GET /api/expenses/:id
 * Requires JWT authentication
 */
router.get('/:id', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        user_id
      },
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

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: {
        expense
      }
    });

  } catch (error) {
    console.error('Error getting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Update expense
 * PUT /api/expenses/:id
 * Requires JWT authentication
 */
router.put('/:id', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { amount, category, subcategory, companions, description, paymentMethod } = req.body;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        user_id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Build update data
    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (subcategory !== undefined) updateData.subcategory = subcategory;
    if (companions !== undefined) updateData.companions = companions;
    if (description !== undefined) updateData.description = description;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        amount: true,
        category: true,
        subcategory: true,
        companions: true,
        date: true,
        paymentMethod: true,
        description: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        expense: updatedExpense
      }
    });

  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Delete expense
 * DELETE /api/expenses/:id
 * Requires JWT authentication
 */
router.delete('/:id', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        user_id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Delete the expense (messages will be handled by cascade or we can delete them explicitly)
    await prisma.expense.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
