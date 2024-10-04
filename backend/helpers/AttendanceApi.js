const attendanceModel = require("../models/AttendanceModel");
const express = require("express");
const router = express.Router();
const officialHolidays = [
    '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
    '2024-07-07', '2024-08-19', '2024-10-12', "2024-09-06",
    '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
]

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
//         status: originalStatus, // Rename the incoming status to avoid conflict
//         reasonValue,
//         isAddedManually
//     } = req.body;

//     const reason = reasonValue ? reasonValue : "";

//     try {
//         const selectedDate = new Date(attendanceDate);
//         const year = selectedDate.getFullYear();
//         const month = selectedDate.toLocaleString('default', { month: 'long' });
//         const day = selectedDate.getDate();

//         // Find the existing attendance record
//         let attendance = await attendanceModel.findById(id);

//         let status = originalStatus; // Use a let variable for status to allow reassignment

//         if (!attendance) {
//             // Create a new attendance record if none exists
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
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason, // Initialize with LC1 if status is LC
//                             isAddedManually: isAddedManually
//                         }]
//                     }]
//                 }]
//             });
//         } else {
//             // Find the year in the existing attendance record
//             let yearArray = attendance.years.find(y => y.year === year);

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
//                         month: month,
//                         days: [{
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         }]
//                     });
//                 } else {
//                     //If status is LC, check how many LC entries already exist for the month
//                     if (status === "LC") {
//                         let dayArray = monthArray.days.find(d => d.date === day);

//                         if (dayArray && dayArray.status.startsWith("LC")) {
//                             // If the day already has an LC status, do not increment the count
//                             status = dayArray.status;
//                         } else {
//                             const lcCount = monthArray.days.filter(d => d.status.startsWith("LC")).length;
//                             if (lcCount < 3) {
//                                 status = `LC${lcCount + 1}`; // Increment the LC count up to LC3
//                             } else {
//                                 // If the LC count exceeds 3, set status to LCH
//                                 status = 'LCH';

//                                 // Convert all previous LC1, LC2, LC3 in the same month to LCH
//                                 monthArray.days.forEach(d => {
//                                     if (d.status.startsWith("LC")) {
//                                         d.status = 'LCH'; // Convert all LC statuses to LCH
//                                     }
//                                 });
//                             }
//                         }
//                     }
//                     let dayArray = monthArray.days.find(d => d.date === day);

//                     if (!dayArray) {
//                         monthArray.days.push({
//                             date: day,
//                             dayName: dayName,
//                             inTime: inTime,
//                             outTime: outTime,
//                             workingHours: workingHours,
//                             status: status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         });
//                     } else {
//                         if (!inTime && !outTime && !workingHours && !status) {
//                             // If inTime, outTime, workingHours, and status are empty, remove the day
//                             monthArray.days = monthArray.days.filter(d => d.date !== day);
//                         } else {
//                             // Update existing day
//                             dayArray.inTime = inTime;
//                             dayArray.outTime = outTime;
//                             dayArray.workingHours = workingHours;
//                             dayArray.status = status;
//                             dayArray.reasonValue = reason;
//                             dayArray.isAddedManually = isAddedManually !== undefined ? isAddedManually : dayArray.isAddedManually;
//                         }
//                     }
//                     // After clearing, re-check the number of LC statuses for the month
//                     let lcEntries = monthArray.days.filter(d => d.status.startsWith('LC'));
//                     // If status is LC, re-assign LC numbers (LC1, LC2, LC3)
//                     if (status === "LC") {
//                         const lcCount = lcEntries.length;
//                         if (lcCount < 3) {
//                             status = `LC${lcCount + 1}`;
//                         } else {
//                             status = 'LCH'; // If LC count exceeds 3, set to LCH
//                             lcEntries.forEach(d => {
//                                 d.status = 'LCH'; // Update all previous LC entries to LCH
//                             });
//                         }
//                     }
//                     // Recalculate the LC statuses if an LC was cleared or updated
//                     lcEntries = monthArray.days.filter(d => d.status.startsWith('LC'));
//                     lcEntries.forEach((entry, index) => {
//                         entry.status = `LC${index + 1}`; // Reassign LC statuses in sequence
//                     });

//                     // If LC entries exceed 3, set them all to LCH
//                     if (lcEntries.length > 3) {
//                         lcEntries.forEach(entry => {
//                             entry.status = 'LCH';
//                         });
//                     }
//                 }
//             }
//         }


//         // Add logic to handle Sundays and official holidays
//         const previousDay = new Date(selectedDate);
//         previousDay.setDate(previousDay.getDate() - 1);

//         const prevYear = previousDay.getFullYear();
//         const prevMonth = previousDay.toLocaleString('default', { month: 'long' });
//         const prevDate = previousDay.getDate();
//         const prevDayName = previousDay.toLocaleString('default', { weekday: 'long' });

//         const isSunday = previousDay.getDay() === 0;
//         const formattedPrevDate = `${prevDate < 10 ? '0' + prevDate : prevDate}-${previousDay.getMonth() + 1}-${prevYear}`;
//         const isHoliday = officialHolidays.includes(formattedPrevDate);

//         if (isSunday || isHoliday) {
//             let prevYearArray = attendance.years.find(y => y.year === prevYear);
//             if (!prevYearArray) {
//                 attendance.years.push({
//                     year: prevYear,
//                     months: [{
//                         month: prevMonth,
//                         days: [{
//                             date: prevDate,
//                             dayName: prevDayName,
//                             status: determineSundayOrHolidayStatus(attendance, year, month, day),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "Auto-filled based on surrounding days",
//                             isAddedManually: false
//                         }]
//                     }]
//                 });
//             } else {
//                 let prevMonthArray = prevYearArray.months.find(m => m.month === prevMonth);
//                 if (!prevMonthArray) {
//                     prevYearArray.months.push({
//                         month: prevMonth,
//                         days: [{
//                             date: prevDate,
//                             dayName: prevDayName,
//                             status: determineSundayOrHolidayStatus(attendance, year, month, day),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "",
//                             isAddedManually: false
//                         }]
//                     });
//                 } else {
//                     let prevDayArray = prevMonthArray.days.find(d => d.date === prevDate);
//                     if (!prevDayArray) {
//                         prevMonthArray.days.push({
//                             date: prevDate,
//                             dayName: prevDayName,
//                             status: determineSundayOrHolidayStatus(attendance, year, month, day),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "Auto-filled based on surrounding days",
//                             isAddedManually: false
//                         });
//                     }
//                 }
//             }
//         }

//         // Function to determine Sunday or Holiday status based on surrounding days
//         function determineSundayOrHolidayStatus(attendance, year, month, day) {
//             const prevDayStatus = attendance.years.find(y => y.year === year)?.months.find(m => m.month === month)?.days.find(d => d.date === day - 1)?.status;
//             const nextDayStatus = attendance.years.find(y => y.year === year)?.months.find(m => m.month === month)?.days.find(d => d.date === day + 1)?.status;

//             if (
//                 (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
//                 (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
//             ) {
//                 return "SL";
//             } else if (
//                 (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
//                 (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
//             ) {
//                 return "SH";
//             } else {
//                 return "S";
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

//     try {
//         console.log("Adding attendance for:", employeeId, "Date:", attendanceDate);
//         const selectedDate = new Date(attendanceDate);
//         const year = selectedDate.getFullYear();
//         const month = selectedDate.toLocaleString('default', { month: 'long' });
//         const day = selectedDate.getDate();

//         // Find the existing attendance record
//         let attendance = await attendanceModel.findById(id);
//         console.log("Existing attendance found:", attendance ? true : false);

//         let status = originalStatus;

//         if (!attendance) {
//             console.log("No attendance record found, creating new...");
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
//                             dayName: dayName || selectedDate.toLocaleString('default', { weekday: 'long' }), // Ensure dayName is set
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually
//                         }]
//                     }]
//                 }]
//             });
//         } else {
//             console.log("Updating existing attendance...");
//             let yearArray = attendance.years.find(y => y.year === year);

//             if (!yearArray) {
//                 attendance.years.push({
//                     year,
//                     months: [{
//                         month,
//                         days: [{
//                             date: day,
//                             dayName: dayName || selectedDate.toLocaleString('default', { weekday: 'long' }),
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually
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
//                             dayName: dayName || selectedDate.toLocaleString('default', { weekday: 'long' }),
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually
//                         }]
//                     });
//                 } else {
//                     let dayArray = monthArray.days.find(d => d.date === day);

//                     if (!dayArray) {
//                         monthArray.days.push({
//                             date: day,
//                             dayName: dayName || selectedDate.toLocaleString('default', { weekday: 'long' }),
//                             inTime,
//                             outTime,
//                             workingHours,
//                             status,
//                             reasonValue: reason,
//                             isAddedManually
//                         });
//                     } else {
//                         if (!inTime && !outTime && !workingHours && !status) {
//                             monthArray.days = monthArray.days.filter(d => d.date !== day);
//                         } else {
//                             dayArray.inTime = inTime;
//                             dayArray.outTime = outTime;
//                             dayArray.workingHours = workingHours;
//                             dayArray.status = status;
//                             dayArray.reasonValue = reason;
//                             dayArray.isAddedManually = isAddedManually !== undefined ? isAddedManually : dayArray.isAddedManually;
//                         }
//                     }
//                 }
//             }
//         }

//         // Add logic to handle Sundays and official holidays
//         const previousDay = new Date(selectedDate);
//         previousDay.setDate(previousDay.getDate() - 1);

//         const isSunday = previousDay.getDay() === 0;
//         const formattedPrevDate = `${previousDay.getDate()}-${previousDay.getMonth() + 1}-${previousDay.getFullYear()}`;
//         const isHoliday = officialHolidays.includes(formattedPrevDate);

//         if (isSunday || isHoliday) {
//             console.log("Adding Sunday/Holiday to the attendance record...");
//             const prevWorkingDate = findPrevWorkingDay(year, selectedDate.getMonth() + 1, day);
//             const nextWorkingDate = findNextWorkingDay(year, selectedDate.getMonth() + 1, day);

//             const prevDayStatus = getDayStatus(attendance, prevWorkingDate.year, prevWorkingDate.month, prevWorkingDate.day);
//             const nextDayStatus = getDayStatus(attendance, nextWorkingDate.year, nextWorkingDate.month, nextWorkingDate.day);

//             let prevYearArray = attendance.years.find(y => y.year === prevWorkingDate.year);
//             if (!prevYearArray) {
//                 attendance.years.push({
//                     year: prevWorkingDate.year,
//                     months: [{
//                         month: getMonthName(prevWorkingDate.month),
//                         days: [{
//                             date: prevWorkingDate.day,
//                             dayName: new Date(prevWorkingDate.year, prevWorkingDate.month - 1, prevWorkingDate.day).toLocaleString('default', { weekday: 'long' }), // Set dayName properly
//                             status: determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "Auto-filled based on surrounding days",
//                             isAddedManually: false
//                         }]
//                     }]
//                 });
//             } else {
//                 let prevMonthArray = prevYearArray.months.find(m => m.month === getMonthName(prevWorkingDate.month));
//                 if (!prevMonthArray) {
//                     prevYearArray.months.push({
//                         month: getMonthName(prevWorkingDate.month),
//                         days: [{
//                             date: prevWorkingDate.day,
//                             dayName: new Date(prevWorkingDate.year, prevWorkingDate.month - 1, prevWorkingDate.day).toLocaleString('default', { weekday: 'long' }), // Set dayName properly
//                             status: determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "Auto-filled based on surrounding days",
//                             isAddedManually: false
//                         }]
//                     });
//                 } else {
//                     let prevDayArray = prevMonthArray.days.find(d => d.date === prevWorkingDate.day);
//                     if (!prevDayArray) {
//                         prevMonthArray.days.push({
//                             date: prevWorkingDate.day,
//                             dayName: new Date(prevWorkingDate.year, prevWorkingDate.month - 1, prevWorkingDate.day).toLocaleString('default', { weekday: 'long' }), // Set dayName properly
//                             status: determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus),
//                             inTime: "",
//                             outTime: "",
//                             workingHours: "",
//                             reasonValue: "Auto-filled based on surrounding days",
//                             isAddedManually: false
//                         });
//                     }
//                 }
//             }
//         }
//         // Helper function to find the previous working day
//         function findPrevWorkingDay(year, month, startDay) {
//             let currentDay = startDay - 1;
//             let currentMonth = month;
//             let currentYear = year;

//             while (true) {
//                 if (currentDay < 1) {
//                     currentMonth--;
//                     if (currentMonth < 1) {
//                         currentMonth = 12;
//                         currentYear--;
//                     }
//                     currentDay = new Date(currentYear, currentMonth, 0).getDate();
//                 }

//                 const formattedDate = `${currentDay < 10 ? '0' + currentDay : currentDay}-${currentMonth}-${currentYear}`;
//                 const isSunday = new Date(currentYear, currentMonth - 1, currentDay).getDay() === 0;
//                 const isHoliday = officialHolidays.includes(formattedDate);

//                 if (!isSunday && !isHoliday) {
//                     break;
//                 }
//                 currentDay--;
//             }

//             return { year: currentYear, month: currentMonth, day: currentDay };
//         }
//         // Helper function to find the next working day
//         function findNextWorkingDay(year, month, startDay) {
//             let currentDay = startDay + 1;
//             let currentMonth = month;
//             let currentYear = year;

//             while (true) {
//                 const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
//                 if (currentDay > daysInCurrentMonth) {
//                     currentMonth++;
//                     if (currentMonth > 12) {
//                         currentMonth = 1;
//                         currentYear++;
//                     }
//                     currentDay = 1;
//                 }

//                 const formattedDate = `${currentDay < 10 ? '0' + currentDay : currentDay}-${currentMonth}-${currentYear}`;
//                 const isSunday = new Date(currentYear, currentMonth - 1, currentDay).getDay() === 0;
//                 const isHoliday = officialHolidays.includes(formattedDate);

//                 if (!isSunday && !isHoliday) {
//                     break;
//                 }
//                 currentDay++;
//             }

//             return { year: currentYear, month: currentMonth, day: currentDay };
//         }

//         // Helper function to determine the correct status
//         function determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus) {
//             if ((prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
//                 (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "Half Day" && nextDayStatus === "Leave")) {
//                 return "SL";
//             } else if ((prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
//                 (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
//                 (prevDayStatus === "Half Day" && nextDayStatus === "LCH")) {
//                 return "SH";
//             } else {
//                 return "S";
//             }
//         }

//         // Helper function to get day status from attendance
//         function getDayStatus(attendance, year, month, day) {
//             return attendance.years.find(y => y.year === year)?.months.find(m => m.month === getMonthName(month))?.days.find(d => d.date === day)?.status;
//         }

//         function getMonthName(monthNumber) {
//             return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
//         }

//         console.log("Saving attendance...");
//         const savedAttendance = await attendance.save();
//         console.log("Attendance saved successfully:", savedAttendance);
//         res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });

//     } catch (error) {
//         console.error('Error adding/updating attendance:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


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

//     try {
//         const selectedDate = new Date(attendanceDate);
//         const year = selectedDate.getFullYear();
//         const month = selectedDate.toLocaleString('default', { month: 'long' });
//         const day = selectedDate.getDate();

//         // Find the existing attendance record
//         let attendance = await attendanceModel.findById(id);

//         let status = originalStatus;

//         if (!attendance) {
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
//                             status: status === "LC" ? "LC1" : status,
//                             reasonValue: reason,
//                             isAddedManually: isAddedManually
//                         }]
//                     }]
//                 }]
//             });
//         } else {
//             let yearArray = attendance.years.find(y => y.year === year);
//             if (!yearArray) {
//                 yearArray = { year: year, months: [] };
//                 attendance.years.push(yearArray);
//             }

//             let monthArray = yearArray.months.find(m => m.month === month);
//             if (!monthArray) {
//                 monthArray = { month: month, days: [] };
//                 yearArray.months.push(monthArray);
//             }

//             let dayArray = monthArray.days.find(d => d.date === day);
//             if (!dayArray) {
//                 monthArray.days.push({
//                     date: day,
//                     dayName: dayName,
//                     inTime: inTime,
//                     outTime: outTime,
//                     workingHours: workingHours,
//                     status: status === "LC" ? "LC1" : status,
//                     reasonValue: reason,
//                     isAddedManually: isAddedManually
//                 });
//             } else {
//                 if (!inTime && !outTime && !workingHours && !status) {
//                     monthArray.days = monthArray.days.filter(d => d.date !== day);
//                 } else {
//                     dayArray.inTime = inTime;
//                     dayArray.outTime = outTime;
//                     dayArray.workingHours = workingHours;
//                     dayArray.status = status;
//                     dayArray.reasonValue = reason;
//                     dayArray.isAddedManually = isAddedManually !== undefined ? isAddedManually : dayArray.isAddedManually;
//                 }
//             }
//         }

//         // Add logic to handle Sundays and official holidays
//         const previousDay = new Date(selectedDate);
//         previousDay.setDate(previousDay.getDate() - 1);

//         const isSunday = previousDay.getDay() === 0;
//         const formattedPrevDate = `${previousDay.getFullYear()}-${String(previousDay.getMonth() + 1).padStart(2, '0')}-${String(previousDay.getDate()).padStart(2, '0')}`;
//         const isHoliday = officialHolidays.includes(formattedPrevDate);
//         console.log("formattedDate", formattedPrevDate, isHoliday)

//         function determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus) {
//             if (isSunday) {
//                 if (
//                     (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
//                     (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
//                 ) {
//                     return "SL"; // Sunday Leave
//                 } else if (
//                     (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
//                     (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
//                 ) {
//                     return "SH"; // Sunday Half-day
//                 } else {
//                     return "S"; // Regular Sunday
//                 }
//             } else if (isHoliday) {
//                 if (
//                     (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
//                     (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
//                 ) {
//                     return "OHH"; // Holiday Leave
//                 } else if (
//                     (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
//                     (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
//                     (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
//                 ) {
//                     return "OHL"; // Holiday Half-day
//                 } else if (prevDayStatus === "Leave" || nextDayStatus === "Leave") {
//                     return "OHL"; // Official Holiday treated like leave if adjacent to leave
//                 } else {
//                     return "OH"; // Regular Holiday
//                 }
//             }

//         }
//         if (isSunday || isHoliday) {
//             console.log(`Adding entry for ${isSunday ? 'Sunday' : 'Holiday'} on ${formattedPrevDate}`);

//             const prevWorkingDay = findPrevWorkingDay(year, selectedDate.getMonth() + 1, day);
//             const nextWorkingDay = findNextWorkingDay(year, selectedDate.getMonth() + 1, day);

//             const prevDayStatus = getDayStatus(attendance, prevWorkingDay.year, prevWorkingDay.month, prevWorkingDay.day);
//             const nextDayStatus = getDayStatus(attendance, nextWorkingDay.year, nextWorkingDay.month, nextWorkingDay.day);
//             const calculatedStatus = determineSundayOrHolidayStatus(prevDayStatus, nextDayStatus);
//             console.log(`Calculated status: ${calculatedStatus}`);

//             if (calculatedStatus) {
//                 addEntryToAttendance(attendance, previousDay, calculatedStatus);
//             }
//         }

//         console.log("Saving attendance...");
//         const savedAttendance = await attendance.save();
//         res.status(200).json({ message: 'Attendance added/updated successfully', data: savedAttendance });

//     } catch (error) {
//         console.error('Error adding/updating attendance:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Helper function to add an entry to attendance
// function addEntryToAttendance(attendance, date, status) {
//     const year = date.getFullYear();
//     const month = date.toLocaleString('default', { month: 'long' });
//     const day = date.getDate();
//     const dayName = date.toLocaleString('default', { weekday: 'long' });

//     let yearArray = attendance.years.find(y => y.year === year);
//     if (!yearArray) {
//         yearArray = { year: year, months: [] };
//         attendance.years.push(yearArray);
//     }

//     let monthArray = yearArray.months.find(m => m.month === month);
//     if (!monthArray) {
//         monthArray = { month: month, days: [] };
//         yearArray.months.push(monthArray);
//     }

//     let dayArray = monthArray.days.find(d => d.date === day);
//     if (!dayArray) {
//         monthArray.days.push({
//             date: day,
//             dayName: dayName,
//             status: status,
//             inTime: "",
//             outTime: "",
//             workingHours: "",
//             reasonValue: "Auto-filled based on surrounding days",
//             isAddedManually: false
//         });
//         console.log(`Added entry: ${year}-${month}-${day}, status: ${status}`);
//     } else {
//         console.log(`Day already exists for ${year}-${month}-${day}, skipping entry.`);
//     }
// }



// // Function to find previous working day
// function findPrevWorkingDay(year, month, startDay) {
//     let currentDay = startDay - 1;
//     let currentMonth = month;
//     let currentYear = year;

//     while (true) {
//         if (currentDay < 1) {
//             currentMonth--;
//             if (currentMonth < 1) {
//                 currentMonth = 12;
//                 currentYear--;
//             }
//             currentDay = new Date(currentYear, currentMonth, 0).getDate();
//         }

//         const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
//         const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
//         const isSunday = dateToCheck.getDay() === 0;
//         const isHoliday = officialHolidays.includes(formattedDate);

//         if (!isSunday && !isHoliday) {
//             break;
//         }
//         currentDay--;
//     }

//     return { year: currentYear, month: currentMonth, day: currentDay };
// }

// // Function to find next working day
// function findNextWorkingDay(year, month, startDay) {
//     let currentDay = startDay + 1;
//     let currentMonth = month;
//     let currentYear = year;

//     while (true) {
//         const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

//         if (currentDay > daysInMonth) {
//             currentMonth++;
//             if (currentMonth > 12) {
//                 currentMonth = 1;
//                 currentYear++;
//             }
//             currentDay = 1;
//         }

//         const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
//         const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
//         const isSunday = dateToCheck.getDay() === 0;
//         const isHoliday = officialHolidays.includes(formattedDate);

//         if (!isSunday && !isHoliday) {
//             break;
//         }
//         currentDay++;
//     }

//     return { year: currentYear, month: currentMonth, day: currentDay };
// }

// // Function to get the status of a day
// function getDayStatus(attendance, year, month, day) {
//     const yearArray = attendance.years.find(y => y.year === year);
//     if (yearArray) {
//         const monthArray = yearArray.months.find(m => m.month === month);
//         if (monthArray) {
//             const dayArray = monthArray.days.find(d => d.date === day);
//             if (dayArray) {
//                 return dayArray.status;
//             }
//         }
//     }
//     return null;
// }


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