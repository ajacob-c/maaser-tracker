const express = require("express");
const Income = require("../models/Income");
const Tzedaka = require("../models/Tzedaka");
const auth = require("../middleware/auth");
const { asyncHandler, AppError } = require("../utils/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/monthly/:userId", auth, asyncHandler(async (req, res) => {
    logger.info('Monthly summary being fetched', {
        userId: req.params.userId,
        month: req.query.month,
        year: req.query.year
    });

    // Verify user is requesting their own data
    if (req.params.userId !== req.user.id) {
        logger.warn('Unauthorized access attempt to summary data', {
            requestingUserId: req.user.id,
            targetUserId: req.params.userId
        });
        throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
    }

    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Validate month and year
    if (month < 1 || month > 12) {
        throw new AppError("Invalid month", 400, "INVALID_MONTH");
    }

    if (year < 1900 || year > 2100) {
        throw new AppError("Invalid year", 400, "INVALID_YEAR");
    }

    // Use UTC dates for consistency
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    
    logger.debug("Date range:", { startDate, endDate });

    // Find incomes with or without timestamps, sorted by date
    const incomes = await Income.find({
        user: req.params.userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    })
    .sort({ date: 1 })
    .lean();

    // Find tzedaka with or without timestamps, sorted by date
    const tzedaka = await Tzedaka.find({
        user: req.params.userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    })
    .sort({ date: 1 })
    .lean();

    const totalIncome = incomes.reduce((acc, i) => acc + (i.amount || 0), 0);
    const maaser = totalIncome * 0.1;
    const totalTzedaka = tzedaka.reduce((acc, t) => acc + (t.amount || 0), 0);
    const balance = maaser - totalTzedaka;
    const netIncome = totalIncome - maaser;

    logger.info('Monthly summary fetched successfully', {
        userId: req.params.userId,
        month,
        year,
        totalIncome,
        totalTzedaka,
        balance
    });

    res.json({ 
        status: 'success',
        data: { totalIncome, maaser, totalTzedaka, balance, netIncome },
        month,
        year
    });
}));

router.get("/yearly/:userId", auth, asyncHandler(async (req, res) => {
    logger.info('Yearly summary being fetched', {
        userId: req.params.userId,
        year: req.query.year
    });

    // Verify user is requesting their own data
    if (req.params.userId !== req.user.id) {
        logger.warn('Unauthorized access attempt to summary data', {
            requestingUserId: req.user.id,
            targetUserId: req.params.userId
        });
        throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
    }

    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Validate year
    if (year < 1900 || year > 2100) {
        throw new AppError("Invalid year", 400, "INVALID_YEAR");
    }

    // Use UTC dates for consistency
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));
    
    logger.debug("Date range:", { startDate, endDate });

    // Find incomes with or without timestamps, sorted by date
    const incomes = await Income.find({
        user: req.params.userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    })
    .sort({ date: 1 })
    .lean();

    // Find tzedaka with or without timestamps, sorted by date
    const tzedaka = await Tzedaka.find({
        user: req.params.userId,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    })
    .sort({ date: 1 })
    .lean();

    logger.debug("Data found:", { 
        incomesCount: incomes.length, 
        tzedakaCount: tzedaka.length 
    });

    const totalIncome = incomes.reduce((acc, i) => acc + (i.amount || 0), 0);
    const maaser = totalIncome * 0.1;
    const totalTzedaka = tzedaka.reduce((acc, t) => acc + (t.amount || 0), 0);
    const balance = maaser - totalTzedaka;
    const netIncome = totalIncome - maaser;

    // Calculate monthly breakdowns using UTC dates
    const monthlyBreakdown = Array(12).fill().map((_, monthIndex) => {
        const monthStart = new Date(Date.UTC(year, monthIndex, 1));
        const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 1));
        
        const monthIncomes = incomes.filter(i => {
            const date = new Date(i.date);
            return date >= monthStart && date < monthEnd;
        });
        
        const monthTzedaka = tzedaka.filter(t => {
            const date = new Date(t.date);
            return date >= monthStart && date < monthEnd;
        });

        const monthIncome = monthIncomes.reduce((acc, i) => acc + (i.amount || 0), 0);
        const monthMaaser = monthIncome * 0.1;
        const monthTzedakaTotal = monthTzedaka.reduce((acc, t) => acc + (t.amount || 0), 0);

        return {
            month: monthIndex + 1,
            monthName: monthStart.toLocaleString('default', { month: 'long', timeZone: 'UTC' }),
            income: monthIncome,
            maaser: monthMaaser,
            tzedaka: monthTzedakaTotal
        };
    });

    logger.info('Yearly summary fetched successfully', {
        userId: req.params.userId,
        year,
        totalIncome,
        totalTzedaka,
        balance
    });

    res.json({
        status: 'success',
        data: {
            totalIncome,
            maaser,
            totalTzedaka,
            balance,
            netIncome,
            monthlyBreakdown
        },
        year
    });
}));

module.exports = router;