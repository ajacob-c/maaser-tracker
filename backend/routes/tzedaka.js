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
        const tzedaka = await Tzedaka.find({user: req.params.userId});
        res.json(tzedaka);
});

module.exports = router;