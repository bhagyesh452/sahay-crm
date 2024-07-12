var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const adminModel = require("../models/Admin.js");
const PerformanceReportModel = require("../models/MonthlyPerformanceReportModel.js");
const TodaysCollectionModel = require("../models/TodaysGeneralProjection.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const EmployeeHistory = require("../models/EmployeeHistory");
const json2csv = require("json2csv").parse;
const deletedEmployeeModel = require("../models/DeletedEmployee.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname and company name
    const employeeName = req.params.employeeName;
    let destinationPath = "";

    if (file.fieldname === "file" && employeeName) {
      destinationPath = `EmployeeImages/${employeeName}`;
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.put("/online-status/:id/:socketID", async (req, res) => {
  const { id } = req.params;
  const { socketID } = req.params;
  console.log("kuhi", socketID);
  try {
    const admin = await adminModel.findByIdAndUpdate(
      id,
      { Active: socketID },
      { new: true }
    );
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/employee-history", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employee = new EmployeeHistory(employeeData);
        const savedEmployee = await employee.save();
      } catch (error) {
        console.error("Error saving employee:", error.message);
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({ message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

router.post("/post-bdmwork-request/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  //console.log("bdmwork" , bdmWork)// Extract bdmWork from req.body
  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });
    // Assuming you're returning updatedCompany and remarksHistory after update
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating BDM work:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/post-bdmwork-revoke/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });

    res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    console.error("error updating bdm work", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/einfo", async (req, res) => {
  try {
    adminModel.create(req.body).then((result) => {
      // Change res to result
      res.json(result); // Change res.json(res) to res.json(result)
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/savedeletedemployee", async (req, res) => {
  const { dataToDelete } = req.body;

  if (!dataToDelete || dataToDelete.length === 0) {
    return res.status(400).json({ error: "No employee data to save" });
  }
  try {
    const newLeads = await Promise.all(
      dataToDelete.map(async (data) => {
        // Retain the original _id
        const newData = {
          ...data,
          _id: data._id,
          deletedDate: new Date().toISOString(),
        };

        // Create a new document in the deletedEmployeeModel with the same _id
        return await deletedEmployeeModel.create(newData);
      })
    );

    res.status(200).json(newLeads);
  } catch (error) {
    console.error("Error saving deleted employee", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deletedemployeeinfo", async (req, res) => {
  try {
    const data = await deletedEmployeeModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/deleteemployeedromdeletedemployeedetails/:id",
  async (req, res) => {
    const { id: itemId } = req.params; // Correct destructuring
    console.log(itemId);
    try {
      const data = await deletedEmployeeModel.findByIdAndDelete(itemId);

      if (!data) {
        return res.status(404).json({ error: "Data not found" });
      } else {
        return res
          .status(200)
          .json({ message: "Data deleted successfully", data });
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/revertbackdeletedemployeeintomaindatabase", async (req, res) => {
  const { dataToRevertBack } = req.body;

  if (!dataToRevertBack || dataToRevertBack.length === 0) {
    return res.status(400).json({ error: "No employee data to save" });
  }

  try {
    const newLeads = await Promise.all(
      dataToRevertBack.map(async (data) => {
        const newData = {
          ...data,
          _id: data._id,
        };
        return await adminModel.create(newData);
      })
    );

    res.status(200).json(newLeads);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      console.error("Duplicate key error:", error.message);
      return res.status(409).json({
        error: "Duplicate key error. Document with this ID already exists.",
      });
    }
    console.error("Error reverting back employee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Read the Employee
router.get("/einfo", async (req, res) => {
  try {
    const data = await adminModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// 3. Update the Employee
router.put("/einfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedData = await adminModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Delete an Employee
router.delete("/einfo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await adminModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/permanentDelete/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const deletedData = await deletedEmployeeModel.findByIdAndDelete(itemId);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/einfo/:email/:password", async (req, res) => {
  const { email, password } = req.params;

  try {
    const data = await adminModel.findOne({ email: email, password: password });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.log("Error fetching employee data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/employeeimages/:employeeName",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

      const employeeName = req.params.employeeName;

      // Find the employee by name
      const employee = await adminModel.findOne({ ename: employeeName });

      if (!employee) {
        return res.status(404).send("Employee Not Found");
      }

      // Construct the file details to store
      const fileDetails = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };

      // Update the employee_profile array
      // employee.employee_profile(fileDetails);
      // await employee.save();

      employee.employee_profile = fileDetails;
      await employee.save();

      // Remove old employee images after uploading the new one
      removeOldEmployeeImages(employeeName, req.file.filename);

      // Handle other logic like saving to database or processing
      res.status(200).send({
        message: "File Uploaded Successfully",
        imageUrl: `/path/to/${req.file.filename}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }

    // This function is remove the old employee profile image then store the latest employee profile image
    function removeOldEmployeeImages(employeeName, newFileName) {
      const directoryPath = path.join(
        __dirname,
        `../EmployeeImages/${employeeName}`
      );

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }

        files.forEach((file) => {
          if (file !== newFileName) {
            const filePath = path.join(directoryPath, file);

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("Deleted old file:", file);
              }
            });
          }
        });
      });
    }
  }
);

router.get("/employeeImg/:employeeName/:filename", (req, res) => {
  const empName = req.params.employeeName;
  const fileName = req.params.filename;
  const pdfPath = path.join(
    __dirname,
    `../EmployeeImages/${empName}/${fileName}`
  );

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});


// Edit Employee Details by HR-Portal

router.post(
  "/post-employee-detail-byhr/:userId",
  async (req, res) => {
    const { userId } = req.params;
    const { personal_email, personal_number, personal_contact_person, personal_address } = req.body;

    try {
      const updatedEmployee = await adminModel.findByIdAndUpdate(
        userId,
        {
          personal_email,
          personal_number,
          personal_contact_person,
          personal_address,
        },
        { new: true } // This option returns the updated document
      );

      if (!updatedEmployee) {
        return res.status(404).send("Employee not found");
      }

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee details:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Employee Performance APIs:
// Add new performance record:
const moment = require('moment'); // Import moment.js for date manipulation
const MonthlyPerformanceReportModel = require("../models/MonthlyPerformanceReportModel.js");

// router.post('/addPerformanceReport', async (req, res) => {
//     try {
//         const { targetDetails, email, achievement } = req.body;

//         // Fetch employee information from adminModel
//         const employeeInfo = await adminModel.findOne({ email: email });

//         if (!employeeInfo) {
//             return res.status(404).json({ result: false, message: 'Employee not found' });
//         }

//         // Calculate previous month and year
//         const today = moment(); // Get current date
//         const previousMonth = today.clone().subtract(1, 'months'); // Calculate previous month
//         const previousMonthIndex = previousMonth.month(); // Get index of previous month (0-11)
//         const previousYear = previousMonth.year(); // Get year of previous month

//         // Process each target detail for the previous month
//         const performanceData = await Promise.all(targetDetails.map(async (target) => {
//             const actualAchievement = Number.isNaN(parseFloat(achievement)) ? 0 : parseFloat(achievement);
//             const actualTargetAmount = Number.isNaN(parseFloat(target.amount)) ? 0 : parseFloat(target.amount);

//             const ratio = actualTargetAmount === 0 ? 0 : (actualAchievement / actualTargetAmount) * 100;
//             let result;

//             // Determine the result based on the ratio
//             if (Math.round(ratio) > 0 && Math.round(ratio) <= 40) {
//                 result = "Poor";
//             } else if (Math.round(ratio) >= 41 && Math.round(ratio) <= 60) {
//                 result = "Below Average";
//             } else if (Math.round(ratio) >= 61 && Math.round(ratio) <= 74) {
//                 result = "Average";
//             } else if (Math.round(ratio) >= 75 && Math.round(ratio) <= 99) {
//                 result = "Good";
//             } else if (Math.round(ratio) >= 100 && Math.round(ratio) <= 149) {
//                 result = "Excellent";
//             } else if (Math.round(ratio) >= 150 && Math.round(ratio) <= 199) {
//                 result = "Extraordinary";
//             } else if (Math.round(ratio) >= 200 && Math.round(ratio) <= 249) {
//                 result = "Outstanding";
//             } else if (Math.round(ratio) >= 250) {
//                 result = "Exceptional";
//             }

//             // Create and save performance report for the previous month
//             return await PerformanceReportModel.create({
//                 empId: employeeInfo._id,
//                 empName: employeeInfo.ename,
//                 month: `${previousMonth.format('MMMM')}-${previousYear}`, // Format month as full name
//                 target: actualTargetAmount,
//                 achievement: actualAchievement,
//                 ratio: Math.round(ratio),
//                 result: result || ""
//             });
//         }));

//         res.status(201).json({ result: true, message: "Data added successfully", data: performanceData });
//     } catch (error) {
//         res.status(500).json({ result: false, message: 'Error creating performance report', error: error.message });
//     }
// });


// Fetch performance report for employee based on empId
router.get('/fetchPerformanceReport/:empId', async (req, res) => {
  const empId = req.params.empId;

  try {
    // Fetch performance reports for the specified employee ID
    const performanceReports = await PerformanceReportModel.find({ empId: empId });
    // console.log("performance", performanceReports)

    // if (!performanceReports || performanceReports.length === 0) {
    //   return res.status(400).json({ result: false, message: 'Performance reports not found for this employee ID' });
    // }

    res.status(200).json({ result: true, message: "Data fetched successfully", data: performanceReports });
  } catch (error) {
    res.status(500).json({ result: false, message: 'Error fetching performance reports', error: error.message });
  }
});

// Update performance record if empId exists otherwise create new performance record:
router.put('/editPerformanceReport/:empId', async (req, res) => {
  try {
    const empId = req.params.empId;
    const { targetDetails, email } = req.body;

    // Find the employee information by email
    const employeeInfo = await adminModel.findOne({ email: email });

    // If employee is not found, return a 404 status with a message
    if (!employeeInfo) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find the existing performance report for the employee
    let performanceReport = await PerformanceReportModel.findOne({ empId });

    // Function to calculate ratio and result
    const calculateRatioAndResult = (achievement, target) => {
      const actualAchievement = Number.isNaN(parseFloat(achievement)) ? 0 : parseFloat(achievement);
      const actualTargetAmount = Number.isNaN(parseFloat(target)) ? 0 : parseFloat(target);
      const ratio = actualTargetAmount === 0 ? 0 : (actualAchievement / actualTargetAmount) * 100;
      let result = "";

      if (Math.round(ratio) >= 0 && Math.round(ratio) <= 40) {
        result = "Poor";
      } else if (Math.round(ratio) >= 41 && Math.round(ratio) <= 60) {
        result = "Below Average";
      } else if (Math.round(ratio) >= 61 && Math.round(ratio) <= 74) {
        result = "Average";
      } else if (Math.round(ratio) >= 75 && Math.round(ratio) <= 99) {
        result = "Good";
      } else if (Math.round(ratio) >= 100 && Math.round(ratio) <= 149) {
        result = "Excellent";
      } else if (Math.round(ratio) >= 150 && Math.round(ratio) <= 199) {
        result = "Extraordinary";
      } else if (Math.round(ratio) >= 200 && Math.round(ratio) <= 249) {
        result = "Outstanding";
      } else if (Math.round(ratio) >= 250) {
        result = "Exceptional";
      }

      return { ratio: Math.round(ratio), result };
    };

    if (performanceReport) {
      // Loop through targetDetails to update or add new details
      for (const detail of targetDetails) {
        const { ratio, result } = calculateRatioAndResult(detail.achievement, detail.target);

        // Find the specific target detail for the month-year combination
        let targetDetail = performanceReport.targetDetails.find(td => td.month === `${detail.month}-${detail.year}`);

        if (targetDetail) {
          // Update the existing target detail
          targetDetail.target = parseFloat(detail.target) || 0;
          targetDetail.achievement = parseFloat(detail.achievement) || 0;
          targetDetail.ratio = ratio;
          targetDetail.result = result;
        } else {
          // Add new target detail for the month-year combination
          performanceReport.targetDetails.push({
            month: `${detail.month}`,
            target: parseFloat(detail.target) || 0,
            achievement: parseFloat(detail.achievement) || 0,
            ratio: ratio,
            result: result
          });
        }
      }

      // Save the updated performance report
      await performanceReport.save();
    } else {
      // Create new performance report if none exists
      const newTargetDetails = targetDetails.map(detail => {
        const { ratio, result } = calculateRatioAndResult(detail.achievement, detail.target);
        return {
          month: `${detail.month}`, // Combine month and year
          target: parseFloat(detail.target) || 0,
          achievement: parseFloat(detail.achievement) || 0,
          ratio: ratio,
          result: result
        };
      });

      performanceReport = await PerformanceReportModel.create({
        empId: empId,
        empName: employeeInfo.ename,
        targetDetails: newTargetDetails
      });
    }

    // Return success response with the performance data
    res.status(200).json({ result: true, message: 'Performance details updated successfully', data: performanceReport });
  } catch (error) {
    // Return error response in case of an exception
    res.status(500).json({ message: 'Error updating performance details', error: error.message });
  }
});

// Todays Projection APIs:
router.post('/addTodaysProjection', async (req, res) => {
  try {
    const { empId, noOfCompany, noOfServiceOffered, totalOfferedPrice, totalCollectionExpected, date, time } = req.body;

    const employeeInfo = await adminModel.findOne({ _id: empId });

    if (!employeeInfo) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const TodaysCollection = await TodaysCollectionModel.create({
      empId: empId,
      empName: employeeInfo.ename,
      noOfCompany: parseInt(noOfCompany),
      noOfServiceOffered: parseInt(noOfServiceOffered),
      totalOfferedPrice: parseInt(totalOfferedPrice),
      totalCollectionExpected: parseInt(totalCollectionExpected),
      date: date || new Date(),
      time: time || new Date()
    });
    res.status(200).json({ result: true, message: "Today's collection successfully added", data: TodaysCollection });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error adding today's collection", error: error });
  }
});

module.exports = router;