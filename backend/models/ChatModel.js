const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    messageData: [
        {
            name: {
                type: String,
            },
            employeeId: {
                type: String,
            },
            message: {
                type: String,
            },
            time: {
                type: String,
            },
            profilePhoto: {
                type: String
            },
            designation: {
                type: String
            },
        }
    ]
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;