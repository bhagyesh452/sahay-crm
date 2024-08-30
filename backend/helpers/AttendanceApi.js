const attendanceModel = require("../models/AttendanceModel");
const express = require("express");
const router = express.Router();

// Adding attendance from id :
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

//     console.log("Request body is:", req.body);

//     try {
//         // Parse the date to extract year, month, and day
//         const selectedDate = new Date(attendanceDate);
//         const year = selectedDate.getFullYear();
//         const month = selectedDate.toLocaleString('default', { month: 'long' }); // e.g., January
//         const day = selectedDate.getDate();

//         // console.log("Parsed Values - Year:", year, "Month:", month, "Day:", day);

//         // Check if the attendance record already exists for this employee and date
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
//                 years: [{
//                     year: year,
//                     months: [{
//                         month: month,
//                         days: [{
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status
//                         }]
//                     }]
//                 }]
//             });
//         } else {
//             // Update the existing document
//             let yearArray = attendance.years.find(y => y.year === year);

//             // If year does not exist, create it
//             if (!yearArray) {
//                 attendance.years.push({
//                     year: year,
//                     months: [{
//                         month: month,
//                         days: [{
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status
//                         }]
//                     }]
//                 });
//             } else {
//                 let monthArray = yearArray.months.find(m => m.month === month);

//                 // If month does not exist, create it
//                 if (!monthArray) {
//                     yearArray.months.push({
//                         month: month,
//                         days: [{
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status
//                         }]
//                     });
//                 } else {
//                     let dayArray = monthArray.days.find(d => d.date === day);

//                     // If day does not exist, create it
//                     if (!dayArray) {
//                         monthArray.days.push({
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status
//                         });
//                     } else {
//                         console.log("status" , status)
//                         // Update existing day
//                         dayArray.dayName = dayName;
//                         dayArray.inTime = inTime;
//                         dayArray.outTime = outTime;
//                         dayArray.workingHours = workingHours;
//                         dayArray.status = status;
//                     }
//                 }
//             }
//         }

//         // Save the attendance document
//         const savedAttendance = await attendance.save();

//         res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });
//     } catch (error) {
//         console.error('Error adding/updating attendance:', error);
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
        status: originalStatus // Rename the incoming status to avoid conflict
    } = req.body;

    try {
        const selectedDate = new Date(attendanceDate);
        const year = selectedDate.getFullYear();
        const month = selectedDate.toLocaleString('default', { month: 'long' });
        const day = selectedDate.getDate();

        // Find the existing attendance record
        let attendance = await attendanceModel.findById(id);

        let status = originalStatus; // Use a `let` variable for status to allow reassignment

        if (!attendance) {
            // Create a new attendance record if none exists
            attendance = new attendanceModel({
                _id: id,
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
                            status: status === "LC" ? "LC1" : status // Initialize with LC1 if status is LC
                        }]
                    }]
                }]
            });
        } else {
            // Find the year in the existing attendance record
            let yearArray = attendance.years.find(y => y.year === year);

            if (!yearArray) {
                attendance.years.push({
                    year: year,
                    months: [{
                        month: month,
                        days: [{
                            date: day,
                            dayName: dayName,
                            inTime: inTime,
                            outTime: outTime,
                            workingHours: workingHours,
                            status: status === "LC" ? "LC1" : status // Initialize with LC1 if status is LC
                        }]
                    }]
                });
            } else {
                let monthArray = yearArray.months.find(m => m.month === month);

                if (!monthArray) {
                    yearArray.months.push({
                        month: month,
                        days: [{
                            date: day,
                            dayName: dayName,
                            inTime: inTime,
                            outTime: outTime,
                            workingHours: workingHours,
                            status: status === "LC" ? "LC1" : status // Initialize with LC1 if status is LC
                        }]
                    });
                } else {
                    // If status is LC, check how many LC entries already exist for the month
                    if (status === "LC") {
                        // Check if the current day already has an LC status
                        let dayArray = monthArray.days.find(d => d.date === day);

                        if (dayArray && dayArray.status.startsWith("LC")) {
                            // If the day already has an LC status, do not increment the count
                            status = dayArray.status;
                        } else {
                            const lcCount = monthArray.days.filter(d => d.status.startsWith("LC")).length;
                            if (lcCount < 3) {
                                status = `LC${lcCount + 1}`; // Increment the LC count up to LC3
                            } else {
                                status = 'LCH'; // Set to LCH if LC count exceeds 3
                            }
                        }
                    }

                    let dayArray = monthArray.days.find(d => d.date === day);

                    if (!dayArray) {
                        monthArray.days.push({
                            date: day,
                            dayName: dayName,
                            inTime: inTime,
                            outTime: outTime,
                            workingHours: workingHours,
                            status: status
                        });
                    } else {
                        // Update the existing day with the new status
                        dayArray.dayName = dayName;
                        dayArray.inTime = inTime;
                        dayArray.outTime = outTime;
                        dayArray.workingHours = workingHours;
                        dayArray.status = status;
                    }
                }
            }
        }

        const savedAttendance = await attendance.save();
        res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });
    } catch (error) {
        console.error('Error adding/updating attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




// Displaying all attendance :
router.get('/viewAllAttendance', async (req, res) => {
    try {
        const attendanceData = await attendanceModel.find();
        res.status(200).json({ result: true, message: "Attendance records successfully displayed", data: attendanceData });
    } catch (error) {
        console.log("Error fetching attendance records", error);
        res.status(500).json({ result: false, message: "Error fetching attendance records" });
    }
});

// Displaying attendance from id :
router.get('/viewAttendance/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const attendanceData = await attendanceModel.findById(id);
        res.status(200).json({ result: true, message: "Attendance record successfully displayed", data: attendanceData });
    } catch (error) {
        console.log("Error fetching attendance record", error);
        res.status(500).json({ result: false, message: "Error fetching attendance record" });
    }
});

module.exports = router;