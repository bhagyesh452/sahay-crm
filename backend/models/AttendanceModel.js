const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        //unique: true,
    },
    employeeName: {
        type: String
    },
    designation: {
        type: String
    },
    department: {
        type: String
    },
    branchOffice: {
        type: String
    },
    years: [{
        year: {
            type: Number,
            required: true
        },
        months: [{
            month: {
                type: String,
                required: true
            },
            days: [{
                date: {
                    type: Number,  // e.g., 1, 2, 3...31
                    required: true
                },
                dayName: {
                    type: String,  // e.g., Monday, Tuesday
                    required: true
                },
                inTime: {
                    type: String,  // e.g., "09:00 AM"
                    default: null
                },
                outTime: {
                    type: String,  // e.g., "06:00 PM"
                    default: null
                },
                workingHours: {
                    type: String,
                    default: null
                },
                status: {
                    type: String,
                    // enum: ['Present', 'Leave', 'Half Day'],
                    default: null 
                    // required: true
                }
            }]
        }]
    }]
}, {
    timestamps: true
});

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = attendanceModel;