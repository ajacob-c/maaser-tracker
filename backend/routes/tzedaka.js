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

        const tzedaka = await Tzedaka.find(query);
        res.json(tzedaka);
    } catch (error) {
        res.status(500).json({message: "Error fetching tzedaka data"});
    }
});

module.exports = router;