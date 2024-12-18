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
            profilePhoto: {
                type: String
            },
            designation: {
                type: String
            },
            message: {
                type: String,
            },
            bookingBdeName: {
                type: String
            },
            closeBy: {
                type: String
            },
            bookingDate: {
                type: Date
            },
            services: {
                type: Array
            },
            projectionBdeName: {
                type: String
            },
            projectionAmount: {
                type: Number
            },
            time: {
                type: String,
            }
        }
    ],
    // bookingData: [
    //     {
    //         bdeName: {
    //             type: String,
    //         },
    //         closeBy: {
    //             type: String
    //         },
    //         bookingDate: {
    //             type: Date
    //         },
    //         services: {
    //             type: Array
    //         },
    //         time: {
    //             type: String,
    //         }
    //     }
    // ],
    // projectionData: [
    //     {
    //         bdeName: {
    //             type: String
    //         },
    //         projectionAmount: {
    //             type: Number
    //         },
    //         time: {
    //             type: String,
    //         }
    //     }
    // ]
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;