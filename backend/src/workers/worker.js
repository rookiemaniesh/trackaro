require('dotenv').config();//Workers run as separate processes, so they need their own dotenv setup.
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { PrismaClient } = require('../../generated/prisma');
const AIClient = require('../services/aiClient');


const prisma = new PrismaClient();
const aiClient = new AIClient();

// Why Separate Connections? why we aren't importing connection
// Different Processes
// server.js
//  runs in one process (your API)
// worker.js
//  runs in a different process (npm run worker)
// If you require('./queue') from worker, it creates a new module instance anyway
// BullMQ Recommendation
// BullMQ docs recommend separate connections for Queue vs Worker
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

const aiWorker = new Worker('ai-processing', async (job) => {
    const { user_id, content, source, userMessageId } = job.data;
    const aiResponse = await aiClient.processMessage(content, user_id)
    if (!aiResponse.success) {
        throw new Error(aiResponse.message);
    }
    const aiData = aiResponse.data;
    if (aiData.type === 'expense') {
        const expense = await prisma.expense.create({
            data: {
                user_id,
                amount: aiData.data.amount,
                category: aiData.data.category,
                subcategory: aiData.data.subcategory,
                companions: aiData.data.companions || [],
                date: new Date(aiData.data.date),
                paymentMethod: aiData.data.paymentMethod || 'unknown',
                description: aiData.data.description
            }
        });

        const message = await prisma.message.create({
            data: {
                user_id,
                content: aiData.message?.output || aiData.message,
                source,
                sender: 'ai',
                expenseId: expense.id
            }
        });
        return {
            messageId: message.id, expenseId: expense.id
        };
    }
    const message = await prisma.message.create({
        data: {
            user_id,
            content: aiData.message?.output || aiData.message,
            source,
            sender: 'ai'
        }
    });
    return { messageId: message.id };
}, { connection });
aiWorker.on('completed', (job) => console.log(`Job ${job.id} Completed`));
aiWorker.on('failed', (job, err) => console.log(`Job ${job.id} failed ${err.message}`));

console.log('🚀 Worker started and listening for jobs...');