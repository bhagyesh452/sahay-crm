const attendanceModel = require("../models/AttendanceModel");
const express = require("express");
const router = express.Router();


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
        status: originalStatus ,// Rename the incoming status to avoid conflict
        reasonValue,
        isAddedManually
    } = req.body;
    const reason = reasonValue ? reasonValue : "";
    //console.log("req.body", req.body)
    try {
        const selectedDate = new Date(attendanceDate);
        const year = selectedDate.getFullYear();
        const month = selectedDate.toLocaleString('default', { month: 'long' });
        const day = selectedDate.getDate();

        // Find the existing attendance record
        let attendance = await attendanceModel.findById(id);

        let status = originalStatus; // Use a let variable for status to allow reassignment

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
                            status: status === "LC" ? "LC1" : status ,
                            reasonValue: reason,// Initialize with LC1 if status is LC
                            isAddedManually:isAddedManually
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
                            status: status === "LC" ? "LC1" : status ,// Initialize with LC1 if status is LC
                            reasonValue: reason,
                            isAddedManually:isAddedManually
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
                            status: status === "LC" ? "LC1" : status, // Initialize with LC1 if status is LC
                            reasonValue: reason,
                            isAddedManually:isAddedManually
                        
                        }]
                    });
                } else {
                    //If status is LC, check how many LC entries already exist for the month
                    if (status === "LC") {
                        let dayArray = monthArray.days.find(d => d.date === day);

                        if (dayArray && dayArray.status.startsWith("LC")) {
                            // If the day already has an LC status, do not increment the count
                            status = dayArray.status;
                        } else {
                            const lcCount = monthArray.days.filter(d => d.status.startsWith("LC")).length;
                            if (lcCount < 3) {
                                status = `LC${lcCount + 1}`; // Increment the LC count up to LC3
                            } else {
                                // If the LC count exceeds 3, set status to LCH
                                status = 'LCH';

                                // Convert all previous LC1, LC2, LC3 in the same month to LCH
                                monthArray.days.forEach(d => {
                                    if (d.status.startsWith("LC")) {
                                        d.status = 'LCH'; // Convert all LC statuses to LCH
                                    }
                                });
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
                            status: status,
                            reasonValue: reason,
                            isAddedManually:isAddedManually
                        });
                    } else {
                        if (!inTime && !outTime && !workingHours && !status) {
                            // If inTime, outTime, workingHours, and status are empty, remove the day
                            monthArray.days = monthArray.days.filter(d => d.date !== day);
                        } else {
                            // Update existing day
                            dayArray.inTime = inTime;
                            dayArray.outTime = outTime;
                            dayArray.workingHours = workingHours;
                            dayArray.status = status;
                            dayArray.reasonValue = reason;
                            dayArray.isAddedManually = isAddedManually !== undefined ? isAddedManually : dayArray.isAddedManually;
                        }

                    }
                    // After clearing, re-check the number of LC statuses for the month
                    let lcEntries = monthArray.days.filter(d => d.status.startsWith('LC'));
                    // If status is LC, re-assign LC numbers (LC1, LC2, LC3)
                    if (status === "LC") {
                        const lcCount = lcEntries.length;
                        if (lcCount < 3) {
                            status = `LC${lcCount + 1}`;
                        } else {
                            status = 'LCH'; // If LC count exceeds 3, set to LCH
                            lcEntries.forEach(d => {
                                d.status = 'LCH'; // Update all previous LC entries to LCH
                            });
                        }
                    }
                    // Recalculate the LC statuses if an LC was cleared or updated
                    lcEntries = monthArray.days.filter(d => d.status.startsWith('LC'));
                    lcEntries.forEach((entry, index) => {
                        entry.status = `LC${index + 1}`; // Reassign LC statuses in sequence
                    });

                    // If LC entries exceed 3, set them all to LCH
                    if (lcEntries.length > 3) {
                        lcEntries.forEach(entry => {
                            entry.status = 'LCH';
                        });
                    }
                }
            }
        }

        // Save the updated attendance record
        const savedAttendance = await attendance.save();
        //console.log("savedAttendance",savedAttendance)
        res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });
    } catch (error) {
        console.error('Error adding/updating attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




// Displaying all attendance :



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
//         status: originalStatus,
//         reasonValue,
//         isAddedManually
//     } = req.body;

//     const reason = reasonValue ? reasonValue : "";
//     const selectedDate = new Date(attendanceDate);
//     const year = selectedDate.getFullYear();
//     const month = selectedDate.toLocaleString('default', { month: 'long' });
//     const day = selectedDate.getDate();

//     try {
//         let attendance = await attendanceModel.findById(id);
//         let status = originalStatus;

//         if (!attendance) {
//             // Create a new attendance record if none exists
//             attendance = new attendanceModel({
//                 _id: id,
//                 employeeId,
//                 employeeName: ename,
//                 designation,
//                 department,
//                 branchOffice,
//                 years: [{
//                     year,
//                     months: [{
//                         month,
//                         days: [{
//                             date: day,
//                             dayName,
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         }]
//                     }]
//                 }]
//             });
//         } else {
//             // Existing attendance, add/update accordingly
//             let yearArray = attendance.years.find(y => y.year === year);
//             if (!yearArray) {
//                 attendance.years.push({
//                     year,
//                     months: [{
//                         month,
//                         days: [{
//                             date: day,
//                             dayName,
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         }]
//                     }]
//                 });
//             } else {
//                 let monthArray = yearArray.months.find(m => m.month === month);
//                 if (!monthArray) {
//                     yearArray.months.push({
//                         month,
//                         days: [{
//                             date: day,
//                             dayName,
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         }]
//                     });
//                 } else {
//                     let dayArray = monthArray.days.find(d => d.date === day);
//                     if (!dayArray) {
//                         monthArray.days.push({
//                             date: day,
//                             dayName,
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         });
//                     } else {
//                         dayArray.inTime = inTime;
//                         dayArray.outTime = outTime;
//                         dayArray.workingHours = workingHours;
//                         dayArray.status = status;
//                         dayArray.reasonValue = reason;
//                         dayArray.isAddedManually = isAddedManually !== undefined ? isAddedManually : dayArray.isAddedManually;
//                     }
//                 }
//             }
//         }

//         // Official Holidays Array
//         const officialHolidays = [
//             '14-01-2024', '15-01-2024', '24-03-2024', '25-03-2024',
//             '07-07-2024', '19-08-2024', '12-10-2024', '31-10-2024',
//             '01-11-2024', '02-11-2024', '03-11-2024', '04-11-2024', '05-11-2024'
//         ];

//         // Function to find the previous working day
//         const findPrevWorkingDay = (currentYear, currentMonth, currentDay) => {
//             let day = currentDay - 1;
//             let month = currentMonth;
//             let year = currentYear;

//             while (day < 1) {
//                 month--;
//                 if (month < 0) {
//                     month = 11;
//                     year--;
//                 }
//                 day = new Date(year, month + 1, 0).getDate();
//             }

//             return new Date(year, month, day);
//         };

//         // Helper function to format a date as DD-MM-YYYY
//         const formatDate = (date) => {
//             const day = String(date.getDate()).padStart(2, '0');
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const year = date.getFullYear();
//             return `${day}-${month}-${year}`;
//         };

//         // Check if the previous day is Sunday or an official holiday
//         const prevDay = findPrevWorkingDay(year, selectedDate.getMonth(), day);
//         const prevDayName = prevDay.toLocaleString('en-US', { weekday: 'long' });
//         const prevDayFormatted = formatDate(prevDay);

//         let prevDayStatus = null;
//         if (attendance) {
//             let prevYear = attendance.years.find(y => y.year === prevDay.getFullYear());
//             let prevMonth = prevYear?.months.find(m => m.month === prevDay.toLocaleString('default', { month: 'long' }));
//             let prevDayArray = prevMonth?.days.find(d => d.date === prevDay.getDate());
//             prevDayStatus = prevDayArray ? prevDayArray.status : null;
//         }

//         if (prevDayName === 'Sunday' || officialHolidays.includes(prevDayFormatted)) {
//             // Determine the new status for the previous day
//             let newPrevDayStatus = null;

//             if (prevDayStatus) {
//                 // Check the status of the current day
//                 if (
//                     (prevDayStatus === "Leave" && status === "Leave") ||
//                     (prevDayStatus === "Leave" && status === "Half Day") ||
//                     (prevDayStatus === "Half Day" && status === "Leave")
//                 ) {
//                     newPrevDayStatus = prevDayName === 'Sunday' ? "SL" : "OHL";
//                 } else if (
//                     (prevDayStatus === "Half Day" && status === "Half Day") ||
//                     (prevDayStatus === "LCH" && status === "LCH") ||
//                     (prevDayStatus === "LCH" && status === "Half Day") ||
//                     (prevDayStatus === "Half Day" && status === "LCH")
//                 ) {
//                     newPrevDayStatus = prevDayName === 'Sunday' ? "SH" : "OHH";
//                 } else {
//                     newPrevDayStatus = prevDayName === 'Sunday' ? "S" : "OH";
//                 }

//                 // Update the previous day's status in the attendance record
//                 let yearArray = attendance.years.find(y => y.year === prevDay.getFullYear());
//                 let monthArray = yearArray?.months.find(m => m.month === prevDay.toLocaleString('default', { month: 'long' }));
//                 let prevDayArray = monthArray?.days.find(d => d.date === prevDay.getDate());
//                 if (prevDayArray) {
//                     prevDayArray.status = newPrevDayStatus;
//                 } else {
//                     // Add previous day if not already present
//                     monthArray.days.push({
//                         date: prevDay.getDate(),
//                         dayName: prevDayName,
//                         inTime: "",
//                         outTime: "",
//                         workingHours: "",
//                         status: newPrevDayStatus,
//                         reasonValue: "",
//                         isAddedManually: false
//                     });
//                 }
//             }
//         }

//         // Save the updated attendance record
//         const savedAttendance = await attendance.save();
//         res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });
//     } catch (error) {
//         console.error('Error adding/updating attendance:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });





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