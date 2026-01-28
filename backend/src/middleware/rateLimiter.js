const rateLimit=require('express-rate-limit');
const aiMessageLimiter=rateLimit({
    windowMs:parseInt(process.env.RATE_LIMIT_AI_WINDOW_MS)||60000,
    max:parseInt(process.env.RATE_LIMIT_AI_MAX)||10,
    message:{
        success:false,
        message:'Too Many Requests, Please Try Again!'
    },
    standardHeaders:true,
    legacyHeaders:false
});
const ocrLimiter=rateLimit({
    windowMs:parseInt(process.env.RATE_LIMIT_OCR_WINDOW_MS)||60000,
    max:parseInt(process.env.RATE_LIMIT_OCR_MAX)||5,
    message:{
        success:false,
        message:'Too Many Requests, Please Try Again!'
    },
    standardHeaders:true,
    legacyHeaders:false
});
const generalLimiter=rateLimit({
    windowMs:parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS)||900000,
    max:parseInt(process.env.RATE_LIMIT_GENERAL_MAX)||100,
    message:{
        success:false,
        message:'Too Many Requests, Please Try Again!'
    },
    standardHeaders:true,
    legacyHeaders:false
});
module.exports={
    aiMessageLimiter,ocrLimiter,generalLimiter
};
