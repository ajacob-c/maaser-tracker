const express = require("express");
const Tzedaka = require("../models/Tzedaka");
const auth = require("../middleware/auth");
const { asyncHandler, AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/add", auth, asyncHandler(async (req, res) => {
    logger.info('Tzedaka entry being added', {
        userId: req.user.id,
        amount: req.body.amount,
        organization: req.body.organization
    });

    const { amount, organization, date } = req.body;
    
    if (!amount || !organization) {
        throw new AppError("Amount and organization are required", 400, "MISSING_FIELDS");
    }

    if (amount <= 0) {
        throw new AppError("Amount must be greater than 0", 400, "INVALID_AMOUNT");
    }

    const tzedaka = await Tzedaka.create({
        user: req.user.id, 
        amount,
        organization,
        date: date || new Date()
    });

    logger.info('Tzedaka entry added successfully', {
        tzedakaId: tzedaka._id,
        userId: req.user.id,
        amount: tzedaka.amount
    });

    res.status(201).json({
        status: 'success',
        data: tzedaka,
        message: 'Tzedaka entry added successfully'
    });
}));

router.get("/user/:userId", auth, asyncHandler(async (req, res) => {
    logger.info('Tzedaka data being fetched', {
        userId: req.params.userId,
        year: req.query.year,
        month: req.query.month
    });

    // Verify user is requesting their own data
    if (req.params.userId !== req.user.id) {
        logger.warn('Unauthorized access attempt to tzedaka data', {
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

    const tzedaka = await Tzedaka.find(query).sort({ date: 1 });

    logger.info('Tzedaka data fetched successfully', {
        userId: req.params.userId,
        count: tzedaka.length,
        year,
        month
    });

    res.json({
        status: 'success',
        data: tzedaka,
        count: tzedaka.length,
        year,
        month
    });
}));

module.exports = router;