const express = require("express");
const Income = require("../models/Income");
const Tzedaka = require("../models/Tzedaka");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/monthly/:userId", auth, async (req, res) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    try {
        const incomes = await Income.find({
            user: req.params.userId,
            date: {
                $gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                $lt: new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`)
            },
        });

        const tzedaka = await Tzedaka.find({
            user: req.params.userId,
            date: {
                $gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                $lt: new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`)
            },
        });

        const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
        const maaser = totalIncome * 0.1;
        const totalTzedaka = tzedaka.reduce((acc, t) => acc + t.amount, 0);
        const balance = maaser - totalTzedaka;

        res.json({ totalIncome, maaser, totalTzedaka, balance });
    }
    catch (err) {
        console.error("Summary fetch error:", err);
        res.status(500).json({ message: "Server error while fetching summary" });
    }
});

module.exports = router;