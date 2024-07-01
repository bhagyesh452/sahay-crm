var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const adminModel = require("../models/Admin.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const EmployeeHistory = require("../models/EmployeeHistory");
const json2csv = require("json2csv").parse;
const deletedEmployeeModel = require("../models/DeletedEmployee.js")




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
    adminModel.create(req.body).then((result) => { // Change res to result
      res.json(result); // Change res.json(res) to res.json(result)
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/savedeletedemployee', async (req, res) => {
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
          deletedDate: new Date().toISOString()
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

router.get('/deletedemployeeinfo', async (req, res) => {
  try {
    const data = await deletedEmployeeModel.find()
    res.status(200).json(data)

  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.delete("/deleteemployeedromdeletedemployeedetails/:id", async (req, res) => {
  const { id: itemId } = req.params; // Correct destructuring
  console.log(itemId);
  try {
    const data = await deletedEmployeeModel.findByIdAndDelete(itemId);

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    } else {
      return res.status(200).json({ message: "Data deleted successfully", data });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

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
      return res.status(409).json({ error: "Duplicate key error. Document with this ID already exists." });
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
  const itemId = req.params.id
  console.log(itemId)
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
})

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


router.post("/employeeimages/:employeeName", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No files were uploaded');
    }

    const employeeName = req.params.employeeName;


    // Find the employee by name
    const employee = await adminModel.findOne({ ename: employeeName });

    if (!employee) {
      return res.status(404).send('Employee Not Found');
    }

    // Construct the file details to store
    const fileDetails = {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };

    // Update the employee_profile array
    // employee.employee_profile(fileDetails);
    // await employee.save();

    employee.employee_profile = fileDetails;
    await employee.save();


    // Handle other logic like saving to database or processing
    res.status(200).send({ message: 'File Uploaded Successfully', imageUrl: `/path/to/${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

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

module.exports = router;