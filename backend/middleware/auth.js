const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        logger.warn('Authentication attempt without token', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl
        });
        return res.status(401).json({
            status: 'error',
            message: "Access denied - No token provided",
            errorCode: "NO_TOKEN"
        });
    }

    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        
        logger.debug('User authenticated successfully', {
            userId: verified.id,
            url: req.originalUrl
        });
        
        next();
    } catch(err) {
        logger.warn('Authentication failed', {
            error: err.name,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl
        });
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: "Token expired",
                errorCode: "TOKEN_EXPIRED"
            });
        }
        return res.status(401).json({
            status: 'error',
            message: "Invalid token",
            errorCode: "INVALID_TOKEN"
        });
    }
}