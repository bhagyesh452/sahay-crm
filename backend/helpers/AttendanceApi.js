const attendanceModel = require("../models/AttendanceModel");
const express = require("express");
const router = express.Router();

// router.post('/addAttendance', async (req, res) => {
//     const {
//         id, 
//         employeeId, 
//         ename, 
//         designation, 
//         department, 
//         branchOffice, 
//         attendanceDate, 
//         dayName, 
//         inTime, 
//         outTime, 
//         workingHours, 
//         status
//     } = req.body;

//     try {
//         // Parse the date to extract year, month, and day
//         const selectedDate = new Date(attendanceDate);
//         const year = selectedDate.getFullYear();
//         const month = selectedDate.toLocaleString('default', { month: 'long' }); // e.g., January
//         const day = selectedDate.getDate();

//         // Find or create the document based on employeeId
//         let attendance = await attendanceModel.findById(id);

//         if (!attendance) {
//             // If no document found, create a new one
//             attendance = new attendanceModel({
//                 _id: id,
//                 employeeId: employeeId,
//                 employeeName: ename,
//                 designation: designation,
//                 department: department,
//                 branchOffice: branchOffice,
//                 years: []
//             });
//         }

//         // Check if the year array exists
//         let yearArray = attendance.years.find(y => y.year === year);
//         if (!yearArray) {
//             yearArray = { year: year, months: [] };
//             attendance.years.push(yearArray);
//         }

//         // Check if the month array exists
//         let monthArray = yearArray.months.find(m => m.month === month);
//         if (!monthArray) {
//             monthArray = { month: month, days: [] };
//             yearArray.months.push(monthArray);
//         }

//         // Check if the day exists
//         const existingDay = monthArray.days.find(d => d.date === day);
//         if (existingDay) {
//             // Update existing day
//             existingDay.inTime = inTime;
//             existingDay.outTime = outTime;
//             existingDay.workingHours = workingHours;
//             existingDay.status = status;
//         } else {
//             // Add new day
//             monthArray.days.push({
//                 date: day,
//                 dayName: dayName,
//                 inTime: inTime,
//                 outTime: outTime,
//                 workingHours: workingHours,
//                 status: status
//             });
//         }

//         // Save the attendance document
//         await attendance.save();

//         res.status(200).json({ message: 'Attendance added successfully', data: attendance });
//     } catch (error) {
//         console.error('Error adding attendance:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


router.post('/addAttendance', async (req, res) => {
    const {
        id, 
        employeeId, 
        ename, 
        designation, 
        department, 
        branchOffice, 
        attendanceDate, 
        dayName, 
        inTime, 
        outTime, 
        workingHours, 
        status
    } = req.body;

    console.log("Request body is :", req.body);

    try {
        // Parse the date to extract year, month, and day
        const selectedDate = new Date(attendanceDate);
        const year = selectedDate.getFullYear();
        const month = selectedDate.toLocaleString('default', { month: 'long' }); // e.g., January
        const day = selectedDate.getDate();

        console.log("Parsed Values - Year:", year, "Month:", month, "Day:", day);

         // Always create a new document
         const newAttendance = new attendanceModel({
            _id: id, // Create a new ObjectId for the new document
            employeeId: employeeId,
            employeeName: ename,
            designation: designation,
            department: department,
            branchOffice: branchOffice,
            years: [{
                year: year,
                months: [{
                    month: month,
                    days: [{
                        date: day,
                        dayName: dayName,
                        inTime: inTime,
                        outTime: outTime,
                        workingHours: workingHours,
                        status: status
                    }]
                }]
            }]
        });

        // Save the new attendance document
        const savedAttendance = await newAttendance.save();

        res.status(200).json({ message: 'Attendance added successfully', data: savedAttendance });
    } catch (error) {
        console.error('Error adding attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;