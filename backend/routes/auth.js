const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Register payload:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id });
});

module.exports = router;