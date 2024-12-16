const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Set the time to midnight
            return now;
        },
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