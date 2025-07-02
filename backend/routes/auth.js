const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/register", asyncHandler(async (req, res) => {
    logger.info('User registration attempt', {
        email: req.body.email,
        ip: req.ip
    });

    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new AppError("Email and password required", 400, "MISSING_CREDENTIALS");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400, "INVALID_EMAIL");
    }

    // Validate password strength
    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters long", 400, "WEAK_PASSWORD");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        logger.warn('Registration attempt with existing email', { email });
        throw new AppError("Email already registered", 400, "EMAIL_EXISTS");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, password: hashedPassword });
    
    logger.info('User registered successfully', {
        userId: newUser._id,
        email: newUser.email
    });
    
    res.status(201).json({ 
        status: 'success',
        message: "User registered successfully",
        userId: newUser._id
    });
}));

router.post("/login", asyncHandler(async (req, res) => {
    logger.info('User login attempt', {
        email: req.body.email,
        ip: req.ip
    });

    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new AppError("Email and password required", 400, "MISSING_CREDENTIALS");
    }

    const user = await User.findOne({ email });

    if (!user) {
        logger.warn('Login attempt with non-existent email', { email });
        throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        logger.warn('Login attempt with wrong password', { email });
        throw new AppError("Invalid email or password", 400, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
    );

    logger.info('User logged in successfully', {
        userId: user._id,
        email: user.email
    });

    res.json({ 
        status: 'success',
        token, 
        userId: user._id,
        message: 'Login successful'
    });
}));

module.exports = router;