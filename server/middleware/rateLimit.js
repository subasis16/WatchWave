const rateLimit = require('express-rate-limit');

/**
 * General API rate limit: 200 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' }
});

/**
 * Payment route limiter: 10 requests per 15 minutes per IP
 */
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many payment requests. Please wait before trying again.' }
});

/**
 * Auth-sensitive limiter: 20 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests on this endpoint.' }
});

module.exports = { generalLimiter, paymentLimiter, authLimiter };
