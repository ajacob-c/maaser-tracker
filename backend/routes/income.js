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
            // Monthly view
            query.date = {
                $gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                $lt: new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`)
            };
        } else {
            // Yearly view
            query.date = {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            };
        }

        const incomes = await Income.find(query);
        res.json(incomes);
    } catch (error) {
        res.status(500).json({message: "Error fetching income data"});
    }
});

module.exports = router;