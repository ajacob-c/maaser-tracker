const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");
    if (!token)
        return res.status(401).json({
            message: "Access denied - No token provided"
        });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired",
                code: "TOKEN_EXPIRED"
            });
        }
        return res.status(401).json({
            message: "Invalid token",
            code: "INVALID_TOKEN"
        });
    }
}