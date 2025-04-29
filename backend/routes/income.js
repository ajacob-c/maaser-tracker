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
        const incomes = await Income.find({user: req.params.userId});
        res.json(incomes);
});

module.exports = router;