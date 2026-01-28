const {Queue}=require('bullmq');
const IORedis=require('ioredis');

const connection=new IORedis(process.env.REDIS_URL,{
    maxRetriesPerRequest:null //Required by BullMQ. Without this, BullMQ throws an error. It tells IORedis to keep retrying indefinitely when Redis is temporarily unavailable.
});
const aiQueue=new Queue('ai-processing',{
    connection
});
const ocrQueue=new Queue('ocr-processing',{
    connection
})
module.exports={aiQueue,ocrQueue,connection}