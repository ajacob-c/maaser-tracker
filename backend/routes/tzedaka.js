const express = require("express");
const Tzedaka = require("../models/Tzedaka");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/add", auth, async (req, res) => {
    try {
        const tzedaka = await Tzedaka.create({user: req.user.id, ...req.body});
        res.status(201).json(tzedaka);
    } catch (error) {
        res.status(400).json({message: "Error adding tzedaka"})
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

        const tzedaka = await Tzedaka.find(query).sort({ date: 1 });
        res.json(tzedaka);
    } catch (error) {
        res.status(500).json({message: "Error fetching tzedaka data"});
    }
});

module.exports = router;