const express = require("express");
const Income = require("../models/Income");
const auth = require("../middleware/auth");
const { asyncHandler, AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/add", auth, asyncHandler(async (req, res) => {
    logger.info('Income entry being added', {
        userId: req.user.id,
        amount: req.body.amount,
        source: req.body.source
    });

    const { amount, source, date } = req.body;
    
    if (!amount || !source) {
        throw new AppError("Amount and source are required", 400, "MISSING_FIELDS");
    }

    if (amount <= 0) {
        throw new AppError("Amount must be greater than 0", 400, "INVALID_AMOUNT");
    }

    const income = await Income.create({
        user: req.user.id, 
        amount,
        source,
        date: date || new Date()
    });

    logger.info('Income entry added successfully', {
        incomeId: income._id,
        userId: req.user.id,
        amount: income.amount
    });

    res.status(201).json({
        status: 'success',
        data: income,
        message: 'Income entry added successfully'
    });
}));

router.get("/user/:userId", auth, asyncHandler(async (req, res) => {
    logger.info('Income data being fetched', {
        userId: req.params.userId,
        year: req.query.year,
        month: req.query.month
    });

    // Verify user is requesting their own data
    if (req.params.userId !== req.user.id) {
        logger.warn('Unauthorized access attempt to income data', {
            requestingUserId: req.user.id,
            targetUserId: req.params.userId
        });
        throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
    }

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month) : null;

    // Validate year and month
    if (year < 1900 || year > 2100) {
        throw new AppError("Invalid year", 400, "INVALID_YEAR");
    }

    if (month && (month < 1 || month > 12)) {
        throw new AppError("Invalid month", 400, "INVALID_MONTH");
    }

    let query = {
        user: req.params.userId,
    };

    if (month) {
        // Monthly view - use UTC dates
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));
        query.date = {
            $gte: startDate,
            $lt: endDate
        };
    } else {
        // Yearly view - use UTC dates
        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year + 1, 0, 1));
        query.date = {
            $gte: startDate,
            $lt: endDate
        };
    }

    const incomes = await Income.find(query).sort({ date: 1 });

    logger.info('Income data fetched successfully', {
        userId: req.params.userId,
        count: incomes.length,
        year,
        month
    });
    
    res.json({
        status: 'success',
        data: incomes,
        count: incomes.length,
        year,
        month
    });
}));

module.exports = router;