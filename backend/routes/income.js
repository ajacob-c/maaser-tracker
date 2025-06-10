const express = require("express");
const Income = require("../models/Income");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/add", auth, async (req, res) => {
    try {
        const income = await Income.create({user: req.user.id, ...req.body});
        res.status(201).json(income);
    } catch (error) {
        res.status(400).json({message: "Error adding income"})
    }
});

router.get("/user/:userId", auth, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = req.query.month ? parseInt(req.query.month) : null;

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

        if (!month) {
            console.log(incomes);
        }
        
        res.json(incomes);
    } catch (error) {
        res.status(500).json({message: "Error fetching income data"});
    }
});

module.exports = router;