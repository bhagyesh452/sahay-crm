const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
dotenv.config();
const secretKey = process.env.SECRET_KEY || "mydefaultsecret";
const adminModel = require("../models/Admin.js");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminModel.findOne({ email });

        console.log("user :", user)
        // Check if the use exists or not
        if (!user) {
            return res.status(400).json({ message: "Invaild email or password" });
        }

        // Check if email and password are correct
        if (user.email !== email || user.password !== password) {
            return res.status(400).json({ message: "Invaild email or password" });
        }

        // Check if the user's designation is "Graphic Designer"
        if (user.newDesignation !== "Graphic Designer") {
            return res.status(403).json({ message: "You are not authorized to access this resource" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '10h' });

        // Return success response with token
        return res.status(200).json({ message: "Login successful", token, data: user });
    } catch (error) {
        console.log("Error in login :", error);
        return res.status(500).json({ message: "Internal server error", error: error });
    }
});

module.exports = router;