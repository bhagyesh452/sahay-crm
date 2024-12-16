const express = require("express");
const router = express.Router();
const ChatModel = require("../models/ChatModel");

router.get("/getAllChats", async (req, res) => {
    try {
        const chat = await ChatModel.find();
        res.json({result: true, message: "Chat Successfully fetched", data: chat});
    } catch (error) {
        res.status(500).json({result: false, message: "Error fetching chat", error: error});
    }
});

module.exports = router;