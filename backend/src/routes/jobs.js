const express = require('express');
const { ocrQueue, aiQueue } = require('../services/queue');

const router = express.Router();
router.get('/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { queue = 'ai' } = req.query;
        const selectedQueue = queue === 'ocr' ? ocrQueue : aiQueue;
        const job = await selectedQueue.getJob(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        const state = await job.getState();
        const result = job.returnvalue;
        res.json({
            success: true,
            data: { jobId, state, progress: job.progress, result }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
module.exports = router;
