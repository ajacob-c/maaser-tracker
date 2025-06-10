const express = require("express");
const Income = require("../models/Income");
const Tzedaka = require("../models/Tzedaka");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/monthly/:userId", auth, async (req, res) => {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    try {
        // Use UTC dates for consistency
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));
        console.log("Date range:", startDate, "to", endDate);

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

        res.json({ totalIncome, maaser, totalTzedaka, balance, netIncome });
    }
    catch (err) {
        console.error("Summary fetch error:", err);
        res.status(500).json({ message: "Server error while fetching summary" });
    }
});

router.get("/yearly/:userId", auth, async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    console.log("Yearly summary request for user:", req.params.userId, "year:", year);

    try {
        // Use UTC dates for consistency
        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year + 1, 0, 1));
        console.log("Date range:", startDate, "to", endDate);

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

        console.log("Found incomes:", incomes.length);
        console.log("Found tzedaka:", tzedaka.length);

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

        res.json({
            totalIncome,
            maaser,
            totalTzedaka,
            balance,
            netIncome,
            monthlyBreakdown
        });
    }
    catch (err) {
        console.error("Yearly summary fetch error:", err);
        res.status(500).json({ message: "Server error while fetching yearly summary" });
    }
});

module.exports = router;