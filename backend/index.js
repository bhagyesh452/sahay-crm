const express = require("express");
const cors = require("cors");
// const { Server } = require("socket.io");
// const http = require("http");
// const server = http.createServer(app);
const mongoose = require("mongoose");
const adminModel = require("./models/Admin");
const CompanyModel = require("./models/Leads");
const CompanyRequestModel = require("./models/LeadsRequest");
const RequestModel = require("./models/Request");
const path = require("path");
const fs = require("fs");
const RequestGModel = require("./models/RequestG");
const { exec } = require("child_process");
const jwt = require("jsonwebtoken");
const onlyAdminModel = require("./models/AdminTable");
const LeadModel = require("./models/Leadform");
const DeletedDatabase = require("./models/DeletedCollection");
const { sendMail } = require("./helpers/sendMail");
const { mailFormat } = require("./helpers/mailFormat");
const multer = require("multer");
const RemarksHistory = require("./models/RemarksHistory");
const EmployeeHistory = require("./models/EmployeeHistory");
const LoginDetails = require("./models/loginDetails");
const RequestDeleteByBDE = require("./models/Deleterequestbybde");
const BookingsRequestModel = require("./models/BookingsEdit");

// const http = require('http');
// const socketIo = require('socket.io');
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
var http = require("http").createServer(app);
var socketIO = require("socket.io")(http, {
  cors: {
    origin: " * ",
  },
});
// const server = http.createServer(app);
// const io = socketIo(server);

mongoose

  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });
// const secretKey = 'random32numberjsonwebtokenrequire';
const secretKey = process.env.SECRET_KEY || "mydefaultsecret";

app.get("/api", (req, res) => {
  console.log(req.url);
  res.send("hello from backend!");
});

app.post("/api/admin/login-admin", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Simulate user authentication (replace with actual authentication logic)
  // (u) => u.email === username && u.password === password
  // const user = await adminModel.find();
  const user = await onlyAdminModel.findOne({
    admin_email: username,
    admin_password: password,
  });
  console.log(user);
  if (user) {
    // Generate a JWT token
    console.log("user is appropriate");
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Login for employee

app.post("/api/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({
    email: email,
    password: password,
    designation: "Sales Executive",
  });
  console.log(user);

  if (user) {
    const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    res.json({ newtoken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});
app.post("/api/processingLogin", async (req, res) => {
  const { username, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({
    email: username,
    password: password,
    designation: "Admin Team",
  });

  if (user) {
    const ename = user.ename;
    const processingToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    res.json({ processingToken, ename });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const deleteAllData = async () => {
  try {
    const result = await CompanyModel.deleteMany({});
    console.log(` documents deleted successfully.`);
  } catch (error) {
    console.error("Error deleting documents:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// deleteAllData();

app.post("/api/leads", async (req, res) => {
  const csvData = req.body;
  let counter = 0;
  let sucessCounter = 0;

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        const employee = new CompanyModel(employeeWithAssignData);
        const savedEmployee = await employee.save();
        sucessCounter++;
      } catch (error) {
        console.error("Error saving employee:", error.message);
        counter++;
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({
      message: "Data sent successfully",
      counter: counter,
      sucessCounter: sucessCounter,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});
app.post("/api/employee-history", async (req, res) => {
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
app.post("/api/requestCompanyData", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        const employee = new CompanyRequestModel(employeeWithAssignData);
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

app.post("/api/manual", async (req, res) => {
  const receivedData = req.body;

  // console.log(receivedData);

  try {
    const employee = new CompanyModel(receivedData);
    const savedEmployee = await employee.save();
    console.log("Data sent");
    res
      .status(200)
      .json(savedEmployee || { message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error saving employee:", error.message);
  }
});

app.post("/api/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { Status: newStatus });

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/update-remarks/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks } = req.body;

  try {
    // Update remarks and fetch updated data in a single operation
    await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });

    // Fetch updated data and remarks history
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyId: id });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/api/remarks-delete/:companyId', async (req, res) => {
  const { companyId } = req.params;
  
  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await CompanyModel.findByIdAndUpdate(companyId, { Remarks: "No Remarks Added" }, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/einfo", async (req, res) => {
  try {
    adminModel.create(req.body).then((respond) => {
      res.json(respond);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/einfo", async (req, res) => {
  try {
    const data = await adminModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/leads", async (req, res) => {
  try {
    const data = await CompanyModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/requestCompanyData", async (req, res) => {
  try {
    const data = await CompanyRequestModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/einfo/:id", async (req, res) => {
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
// delete from leads

app.delete("/api/leads/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await CompanyModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete selected rows

app.delete("/api/delete-rows", async (req, res) => {
  const { selectedRows } = req.body;

  try {
    // Use Mongoose to delete rows by their IDs
    await CompanyModel.deleteMany({ _id: { $in: selectedRows } });

    // Trigger backup on the server
    exec(
      `mongodump --db AdminTable --collection newcdatas --out ${process.env.BACKUP_PATH}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error creating backup:", error);
          // Respond with an error if backup fails
          res.status(500).json({ error: "Error creating backup." });
        } else {
          console.log("Backup created successfully:", stdout);
          // Respond with success message if backup is successful
          res.status(200).json({
            message:
              "Rows deleted successfully and backup created successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/undo", (req, res) => {
  // Run mongorestore command to restore the data
  exec(
    `mongorestore --uri "mongodb://localhost:27017/AdminTable" --nsInclude "AdminTable.newcdatas" ${process.env.BACKUP_PATH}\newcdatas.bson
  `,
    (error, stdout, stderr) => {
      if (error) {
        console.error("Error restoring data:", error);
        res.status(500).json({ error: "Error restoring data." });
      } else {
        console.log("Data restored successfully:", stdout);
        res.status(200).json({ message: "Data restored successfully." });
      }
    }
  );
});

app.put("/api/einfo/:id", async (req, res) => {
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
// app.put('/ecompany/:ename', async (req, res) => {
//   const name = req.params.id;

//   try {
//     const updatedData = await CompanyModel.find({ename : name}, { new: true });

//     if (!updatedData) {
//       return res.status(404).json({ error: 'Data not found' });
//     }

//     res.json({ message: 'Data updated successfully', updatedData });
//   } catch (error) {
//     console.error('Error updating data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Assigning data

app.post("/api/postData", async (req, res) => {
  const { employeeSelection, selectedObjects } = req.body;
  // If not assigned, post data to MongoDB or perform any desired action
  const updatePromises = selectedObjects.map((obj) => {
    // Add AssignData property with the current date
    const updatedObj = {
      ...obj,
      ename: employeeSelection,
      AssignDate: new Date(),
    };
    return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
  });

  // Execute all update promises
  await Promise.all(updatePromises);

  res.json({ message: "Data posted successfully" });
});
app.delete("/api/delete-data/:ename", async (req, res) => {
  const { ename } = req.params;

  try {
    // Delete all data objects with the given ename
    await CompanyRequestModel.deleteMany({ ename });

    // Send success response
    res.status(200).send("Data deleted successfully");
  } catch (error) {
    // Send error response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/assign-new", async (req, res) => {
  const { newemployeeSelection, data } = req.body;

  try {
    // Add AssignDate property with the current date
    const updatedObj = {
      ...data,
      ename: newemployeeSelection,
      AssignDate: new Date(),
    };

    // Update CompanyModel for the specific data
    await CompanyModel.updateOne({ _id: data._id }, updatedObj);

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/company", async (req, res) => {
  const { newemployeeSelection, csvdata } = req.body;

  try {
    const insertedCompanies = [];
    let counter = 0;
    for (const company of csvdata) {
      // Check for duplicate based on some unique identifier, like company name
      const isDuplicate = await CompanyModel.exists({
        "Company Name": company["Company Name"].trim().toLowerCase(),
      });

      if (!isDuplicate) {
        // If not a duplicate, add ename and insert into the database
        const companyWithEname = {
          ...company,
          ename: newemployeeSelection,
          AssignDate: new Date(),
        };

        const insertedCompany = await CompanyModel.create(companyWithEname);
        insertedCompanies.push(insertedCompany);
      } else {
        console.log(
          `Duplicate entry found for company name: ${company["Company Name"]}. Skipped.`
        );
        counter++;
      }
    }

    res.json(insertedCompanies, counter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get the company data,
app.get("/api/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;

    // Fetch data from companyModel where ename matches employeeName
    const data = await CompanyModel.find({ ename: employeeName });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for inserting more values to einfo
app.put("/api/neweinfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const existingData = await adminModel.findById(id);

    if (!existingData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Map the incoming data to a format suitable for comparison
    const incomingData = req.body.cInfo.map((data) => ({
      "Company Name": data["Company Name"],
      "Company Number": data["Company Number"],
      "Company Incorporation Date  ": data["Company Incorporation Date  "],
      "Company Email": data["Company Email"],
      City: data.City,
      State: data.State,
    }));

    // Filter out existing entries from the incoming data
    const newData = incomingData.filter((data) => {
      return !existingData.cInfo.some((existing) => {
        return (
          existing["Company Name"] === data["Company Name"] &&
          existing["Company Number"] === data["Company Number"] &&
          existing["Company Incorporation Date  "] ===
            data["Company Incorporation Date  "] &&
          existing["Company Email"] === data["Company Email"] &&
          existing.City === data.City &&
          existing.State === data.State
        );
      });
    });

    // Add the filtered data to the existing array
    existingData.cInfo.push(...newData);

    // Save the updated document
    const updatedData = await existingData.save();

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/newcompanyname/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { ename } = req.body;

    // Validate if 'ename' is provided
    if (!ename) {
      return res.status(400).json({ error: "Ename is required for update" });
    }

    // Find and update the company data
    const updatedData = await CompanyModel.findByIdAndUpdate(
      id,
      { ename: ename },
      { new: true }
    );

    // Check if data was found and updated
    if (!updatedData) {
      return res.status(404).json({ error: "Company data not found" });
    }

    res.json({ message: "Company data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating company data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// api call for employee requesting for the data

app.post("/api/requestData", async (req, res) => {
  const { selectedYear, companyType, numberOfData, name, cTime, cDate } =
    req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestModel({
      year: selectedYear,
      ctype: companyType,
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();

    // Emit a socket event to notify clients about the new request
    socketIO.emit("newRequest", savedRequest);

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/requestgData", async (req, res) => {
  const { numberOfData, name, cTime, cDate } = req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestGModel({
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();
    socketIO.emit("newRequest", savedRequest);
    // Emit a socket.io message when a new request is posted
    // io.emit('newRequest', savedRequest);

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/requestData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/requestgData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestGModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/requestData/:id", async (req, res) => {
  const { id } = req.params;
  const { read, assigned } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestModel.findByIdAndUpdate(
      id,
      { read, assigned },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/api/requestgData/:id", async (req, res) => {
  const { id } = req.params;
  const { read, assigned } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestGModel.findByIdAndUpdate(
      id,
      { read, assigned },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/newcompanynamedelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the document by id and update the ename field to null or an empty string
    const updatedData = await CompanyModel.findByIdAndUpdate(
      id,
      { ename: "Not Alloted" },
      { new: true }
    );

    res.json({ message: "Ename deleted successfully", updatedData });
  } catch (error) {
    console.error("Error deleting ename:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/remarks-history/:companyId", async (req, res) => {
  const { companyId } = req.params;
  const { Remarks } = req.body;

  // Get the current date and time
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Create a new RemarksHistory instance
    const newRemarksHistory = new RemarksHistory({
      time,
      date,
      companyID: companyId,
      remarks: Remarks,
    });

    // Save the new entry to MongoDB
    await newRemarksHistory.save();

    res.json({ success: true, message: "Remarks history added successfully" });
  } catch (error) {
    console.error("Error adding remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/api/remarks-history", async (req, res) => {
  try {
    const remarksHistory = await RemarksHistory.find();
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.delete("/api/remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await RemarksHistory.findByIdAndDelete(id);
    res.json({ success: true, message: "Remarks deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname
    const destinationPath =
      file.fieldname === "otherDocs" ? "./ExtraDocs" : "./PaymentReceipts";
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post(
  "/api/lead-form",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        empName,
        empEmail,
        bookingTime,
      } = req.body;
      const bdeName = empName;
      const bdeEmail = empEmail;

      const otherDocs =
        req.files["otherDocs"] && req.files["otherDocs"].length > 0
          ? req.files["otherDocs"].map((file) => file.filename)
          : [];

      const extraDocuments = req.files["otherDocs"];
      const paymentDoc = req.files["paymentReceipt"];
      console.log(extraDocuments, paymentDoc);
      const paymentReceipt = req.files["paymentReceipt"]
        ? req.files["paymentReceipt"][0].filename
        : null; // Array of files for 'file2'

      // Your processing logic here

      const employee = new LeadModel({
        bdeName,
        bdeEmail,
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        bookingTime,
        otherDocs,
        paymentReceipt,
      });

      const display = caCase === "No" ? "none" : "flex";
      const displayPayment = paymentTerms === "Full Advanced" ? "none" : "flex";

      const savedEmployee = await employee.save();

      const recipients = [
        // "bookings@startupsahay.com",
        // "documents@startupsahay.com",
        `${bdmEmail}`,
        `${bdeName}`,
      ];

      sendMail(
        recipients,
        "Mail received",
        ``,
        `<div style="width: 80%; margin: 50px auto;">
            <h2 style="text-align: center;">Lead Information</h2>
            <div style="display: flex;">
                <div style="width: 48%;">
                    <label>BDE Name:</label>
                    <div style="    padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${empName}
                    </div>
                </div>
                <div style="width: 48%;margin-left: 15px;">
                    <label>BDE Email Address:</label>
                    <div style="    padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${empEmail}
                    </div>
                </div>
            </div>
            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%;">
                    <label>BDM Name:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${bdmName}
                    </div>
                </div>
                <div style="width: 48%;margin-left: 15px;">
                    <label>BDM Email Address:</label>
                    <div style="    padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${bdmEmail}
                    </div>
                </div>
            </div>
            <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
            </div>
            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%;">
                    <label>Booking Date:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${bookingDate}
                    </div>
                </div>

            </div>

            <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
            </div>

            <div style="display: flex; margin-top: 20px;" id="cacase">
                <div style="width: 48%;">
                    <label>CA Case: ${caCase}</label>

                </div>

            </div>
            <div id="ca-case-option" style="display: ${display}; margin-top: 20px;" >
                <div style="width: 30%;">
                    <label>Enter CA's number:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${caNumber}
                    </div>
                </div>
                <div style="width: 30%; margin-left: 10px;">
                    <label>Enter CA's Email:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${caEmail}
                    </div>
                </div>
                <div style="width: 38%; margin-left: 10px;">
                    <label>Enter CA's Commission:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${caCommission}
                    </div>
                </div>

            </div>
            <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
            </div>

            <div style="display: flex; margin-top: 20px;">
                <div style="width: 30%;">
                    <label>Enter Company's Name:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${companyName}
                    </div>
                </div>
                <div style="width: 30%; margin-left: 10px;">
                    <label>Enter Contact Number:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${contactNumber}
                    </div>
                </div>
                <div style="width: 38%; margin-left: 10px;">
                    <label>Enter Company's Email id:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${companyEmail}
                    </div>
                </div>

            </div>

            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%;">
                    <label>Services:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${services}
                    </div>
                </div>

            </div>
            <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
            </div>
            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%; ">
                    <label>Total Payment:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${originalTotalPayment}
                    </div>
                </div>
                <div style="width: 48%;  margin-left: 10px;">
                    <label>Total Payment Including GST</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${totalPayment}
                    </div>
                </div>

            </div>
            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%; ">
                    <label>Payment Terms: ${paymentTerms}</label>

                </div>

            </div>
            <div style="display: ${displayPayment}; margin-top: 20px;">
                <div style="width: 24%; ">
                    <label>First Payment:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${firstPayment}
                    </div>
                    <small style="background: #e7e7e7;
                    padding: 2px 8px;
                    margin: 4px 0;
                    color: rgb(63, 66, 21);
                    display: inline-block;
                    border-radius: 4px;">
                    ${(firstPayment * 100) / totalPayment}% Amount
                    </small>
                </div>
                <div style="width: 24%;  margin-left: 10px;">
                    <label>Second Payment</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${secondPayment}
                    </div>
                    <small style="background: #e7e7e7;
                    padding: 2px 8px;
                    margin: 4px 0;
                    color: rgb(63, 66, 21);
                    display: inline-block;
                    border-radius: 4px;">
                    ${(secondPayment * 100) / totalPayment}% Amount
                    </small>
                </div>
                <div style="width: 24%;  margin-left: 10px;">
                    <label>Third Payment</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${thirdPayment}
                    </div>
                    <small style="background: #e7e7e7;
                    padding: 2px 8px;
                    margin: 4px 0;
                    color: rgb(63, 66, 21);
                    display: inline-block;
                    border-radius: 4px;">
                    ${(thirdPayment * 100) / totalPayment}% Amount
                    </small>
                </div>
                <div style="width: 24%;  margin-left: 10px;">
                    <label>Fourth Payment</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${fourthPayment}
                    </div>
                    <small style="background: #e7e7e7;
                    padding: 2px 8px;
                    margin: 4px 0;
                    color: rgb(63, 66, 21);
                    display: inline-block;
                    border-radius: 4px;">
                    ${(fourthPayment * 100) / totalPayment}% Amount
                    </small>
                </div>

            </div>
            <div style="display: flex; margin-top: 20px;">
            <div style="width: 33%; ">
                    <label>Payment Remarks:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${paymentRemarks}
                    </div>
                </div>

       </div>
            <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
            </div>

            <div style="display: flex; margin-top: 20px;">
                <div style="width: 33%; ">
                    <label>Payment Method:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${paymentMethod}
                    </div>
                </div>
                <div style="width: 33%;  margin-left: 10px;">
                    <label>Booking Source</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${bookingSource}
                    </div>
                </div>
                <div style="width: 33%;  margin-left: 10px;">
                    <label>Company Pan or GST number</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${cPANorGSTnum}
                    </div>
                </div>

            </div>
            <div style="display: flex; margin-top: 20px;">
                <div style="width: 48%; ">
                    <label>Company Incorporation Date:</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${incoDate}
                    </div>
                </div>
                <div style="width: 48%;  margin-left: 10px;">
                    <label>Any Extra Notes</label>
                    <div style=" padding: 8px 10px;
                        background: #fff7e8;
                        margin-top: 10px;
                        border-radius: 6px;
                        color: #724f0d;">
                        ${extraNotes}
                    </div>
                </div>

            </div>

        </div>

        `,
        extraDocuments,
        paymentDoc
      );

      console.log("Data sent Via Email");
      res
        .status(200)
        .json(savedEmployee || { message: "Data sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error saving employee:", error.message);
    }
  }
);
app.post(
  "/api/lead-form2",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        empName,
        empEmail,
        bookingTime,
        otherDocs ,
        paymentReceipt
      } = req.body;
      const bdeName = empName;
      const bdeEmail = empEmail;

      // const otherDocs =
      //   req.files["otherDocs"] && req.files["otherDocs"].length > 0
      //     ? req.files["otherDocs"].map((file) => file.filename)
      //     : [];

      // const extraDocuments = req.files["otherDocs"];
      // const paymentDoc = req.files["paymentReceipt"];
      
      // const paymentReceipt = req.files["paymentReceipt"]
      //   ? req.files["paymentReceipt"][0].filename
      //   : null; // Array of files for 'file2'
   
      // Your processing logic here

      const employee = new BookingsRequestModel({
        bdeName,
        bdeEmail,
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        bookingTime,
        otherDocs,
        paymentReceipt,
      });

      const display = caCase === "No" ? "none" : "flex";
      const displayPayment = paymentTerms === "Full Advanced" ? "none" : "flex";

      const savedEmployee = await employee.save();

      console.log("Data Request Sent Successfully");
      res
        .status(200)
        .json(savedEmployee || { message: "Data sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error saving employee:", error.message);
    }
  }
);

// --------------------api for sending excel data on processing dashboard----------------------------

// app.post("/api/upload/lead-form", async (req, res) => {
//   let counter  = 0;
//   let errorCounter = 0;
//   try {
//     const excelData = req.body; // Assuming req.body is an array of objects
//     console.log(excelData);
   

//     // Loop through each object in the array and save it to the database
//     for (const data of excelData) {
//       const {
//         bdeName,
//         bdeEmail,
//         bdmName,
//         bdmEmail,
//         bdmType,
//         supportedBy,
//         bookingDate,
//         caCase,
//         caNumber,
//         caEmail,
//         caCommission,
//         companyName,
//         contactNumber,
//         companyEmail,
//         services,
//         originalTotalPayment,
//         totalPayment,
//         paymentTerms,
//         paymentMethod,
//         firstPayment,
//         secondPayment,
//         thirdPayment,
//         fourthPayment,
//         paymentRemarks,
//         bookingSource,
//         cPANorGSTnum,
//         incoDate,
//         extraNotes,
//         bookingTime,
//       } = data;

//       const employee = new LeadModel({
//         bdeName,
//         bdeEmail,
//         bdmName,
//         bdmEmail,
//         bdmType,
//         supportedBy,
//         bookingDate,
//         caCase,
//         caNumber,
//         caEmail,
//         caCommission,
//         companyName,
//         contactNumber,
//         companyEmail,
//         services,
//         originalTotalPayment,
//         totalPayment,
//         paymentTerms,
//         paymentMethod,
//         firstPayment,
//         secondPayment,
//         thirdPayment,
//         fourthPayment,
//         paymentRemarks,
//         bookingSource,
//         cPANorGSTnum,
//         incoDate,
//         extraNotes,
//         bookingTime,
//       });

//       await employee.save();
      
//       counter++;

//     }
//     res.status(200).json({ message: "Data sent successfully",counter});
//   } catch (error) {
//     errorCounter++
//     res.status(500).json({ error: "Internal Server Error" , errorCounter });
//     console.error("Error saving employee:", error.message);
//   }
// });

app.post("/api/upload/lead-form", async (req, res) => {
  let successCounter = 0;
  let errorCounter = 0;

  try {
    const excelData = req.body; // Assuming req.body is an array of objects

    // Loop through each object in the array and save it to the database
    for (const data of excelData) {
      try {
        // Destructure data object
        const {
          bdeName,
          bdeEmail,
          bdmName,
          bdmEmail,
          bdmType,
          supportedBy,
          bookingDate,
          caCase,
          caNumber,
          caEmail,
          caCommission,
          companyName,
          contactNumber,
          companyEmail,
          services,
          originalTotalPayment,
          totalPayment,
          paymentTerms,
          paymentMethod,
          firstPayment,
          secondPayment,
          thirdPayment,
          fourthPayment,
          paymentRemarks,
          bookingSource,
          cPANorGSTnum,
          incoDate,
          extraNotes,
          bookingTime,
        } = data;

        // Create a new LeadModel instance with the data
        const employee = new LeadModel({
          bdeName,
          bdeEmail,
          bdmName,
          bdmEmail,
          bdmType,
          supportedBy,
          bookingDate,
          caCase,
          caNumber,
          caEmail,
          caCommission,
          companyName,
          contactNumber,
          companyEmail,
          services,
          originalTotalPayment,
          totalPayment,
          paymentTerms,
          paymentMethod,
          firstPayment,
          secondPayment,
          thirdPayment,
          fourthPayment,
          paymentRemarks,
          bookingSource,
          cPANorGSTnum,
          incoDate,
          extraNotes,
          bookingTime,
        });

        // Save the employee data to the database
        await employee.save();
        
        // Increment the success counter
        successCounter++;
      } catch (error) {
        // If an error occurs during data insertion, increment the error counter
        errorCounter++;
        console.error("Error saving employee:", error.message);
      }
    }

    // Respond with success and error counters
  
    res.status(200).json({ message: "Data sent successfully", successCounter, errorCounter });
  } catch (error) {
    // If an error occurs at the outer try-catch block, handle it here
    console.error("Error saving employees:", error.message);
    res.status(500).json({ error: "Internal Server Error", errorCounter });
  }
});
app.post('/api/accept-booking-request/:companyName', async (req, res) => {
  const companyName = req.params.companyName;
  const requestData = req.body;

  try {
    // Find the data to be moved from BookingsRequestModel

    // Update leadModel data with data from BookingsRequestModel
    const { _id, ...updatedData } = requestData;

    // Update leadModel data with data from BookingsRequestModel
    const updatedLead = await LeadModel.findOneAndUpdate(
      { companyName },
      { $set: updatedData },
      { new: true }
    );

    // Delete the data from BookingsRequestModel
    await BookingsRequestModel.findOneAndDelete({ companyName });

    // Send success response with the updated lead data
    res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Error accepting booking request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/drafts-search/:companyName', async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Find draft data for the company name
    const draft = await DraftModel.findOne({ companyName });

    // Send the draft data as response
    res.status(200).json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ---------------------------api to fetch companies in processing dashboard-----------------------------------

app.get("/api/companies", async (req, res) => {
  try {
    // Fetch only the company names from the LeadModel
    const companies = await LeadModel.find();
    res.json(companies);
  } catch (error) {
    console.error("Error fetching company names:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/company/:companyName", async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Fetch details for the specified company name from the LeadModel
    const companyDetails = await LeadModel.findOne({ companyName });

    if (!companyDetails) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(companyDetails);
  } catch (error) {
    console.error("Error fetching company details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/reverse-delete/:companyName", async (req, res) => {
  try {
    const { companyName } = req.params;

    // Find the deleted company by companyName in DeletedModel
    const deletedCompany = await DeletedDatabase.findOneAndDelete({
      companyName,
    });

    if (deletedCompany) {
      // Move the deleted company from DeletedModel to LeadModel
      await LeadModel.create(deletedCompany.toObject());
      res.json({ message: "Company restored successfully" });
    } else {
      res.status(404).json({ message: "Company not found in deleted records" });
    }
  } catch (error) {
    console.error("Error reversing delete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/company-delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedCompany = await LeadModel.findByIdAndDelete({ _id });
    if (deletedCompany) {
      // Move the deleted company to the DeletedModel collection
      await DeletedDatabase.create(deletedCompany.toObject());
      // Find the same company name in the CompanyModel and update its Status to "Untouched"
      const companyName = deletedCompany.companyName;

      await CompanyModel.findOneAndUpdate(
        { "Company Name": companyName },
        { $set: { Status: "Untouched" } }
      );

      res.status(200).json({ message: "Company Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/deleterequestbybde", async (req, res) => {
  try {
    const { companyName, companyId, time, date, request, ename } = req.body;
    console.log(req.body);
    // Create a new instance of the RequestDeleteByBDE model
    const deleteRequest = new RequestDeleteByBDE({
      companyName,
      companyId,
      time,
      date,
      request,
      ename,
    });

    // Save the delete request to the database
    await deleteRequest.save();

    res.json({ message: "Delete request created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/deleterequestbybde", async (req, res) => {
  try {
    const company = await RequestDeleteByBDE.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/editRequestByBde", async (req, res) => {
  try {
    const company = await BookingsRequestModel.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/deleterequestbybde/:cname", async (req, res) => {
  try {
    const companyName = req.params.cname;

    // Find document by company name and delete it
    const updatedCompany = await RequestDeleteByBDE.findOneAndUpdate(
      { companyName },
      { $set: { request: true } },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // If document is deleted successfully, return the deleted document
    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/loginDetails", (req, res) => {
  const { ename, date, time, address } = req.body;
  const newLoginDetails = new LoginDetails({ ename, date, time, address });
  newLoginDetails
    .save()
    .then((savedLoginDetails) => {
      console.log("Login details saved to database:", savedLoginDetails);
      res.json(savedLoginDetails);
    })
    .catch((error) => {
      console.error("Failed to save login details to database:", error);
      res.status(500).json({ error: "Failed to save login details" });
    });
});

app.get("/api/loginDetails", (req, res) => {
  LoginDetails.find()
    .then((loginDetails) => {
      res.json(loginDetails);
    })
    .catch((error) => {
      console.error("Failed to fetch login details from database:", error);
      res.status(500).json({ error: "Failed to fetch login details" });
    });
});

// ------------------------------------pdf files reader-------------------------------------

app.get('/api/pdf/:filename', (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, 'ExtraDocs' , filepath);

  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error('Error reading PDF file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=example.pdf');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});

app.get('/api/paymentrecieptpdf/:filename', (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, 'PaymentReceipts' , filepath);

  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error('Error reading PDF file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=example.pdf');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});

// app.get('/api/paymentrecieptpdf/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, 'documents', filename);

//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error('File not found:', err);
//       res.status(404).send('File not found');
//       return;
//     }

//     // Determine the content type based on the file extension
//     let contentType;
//     const fileExt = path.extname(filePath).toLowerCase();
//     switch (fileExt) {
//       case '.pdf':
//         contentType = 'application/pdf';
//         break;
//       case '.jpg':
//       case '.jpeg':
//         contentType = 'image/jpeg';
//         break;
//       case '.png':
//         contentType = 'image/png';
//         break;
//       default:
//         contentType = 'application/octet-stream';
//     }

    // Set the response headers
//     res.setHeader('Content-Type', contentType);
//     res.setHeader('Content-Disposition', `inline; filename=${filename}`);
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

//     // Send the file
//     res.sendFile(filePath);
//   });
// });

app.get("/api/recieptpdf/:filename", (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, "PaymentReceipts", filepath);

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

app.get("/api/otherpdf/:filename", (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, "ExtraDocs", filepath);

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

app.get("/download/recieptpdf/:fileName", (req, res) => {
  const fileName = req.params.filePath;
  const filePath = path.join(__dirname, "uploads", fileName);
  console.log(fileName);
  res.setHeader("Content-Disposition", attachment, (fileName = `${fileName}`));
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
  }
);

// ---------------------------to update the read status of companies-------------------------------------


app.put('/api/read/:companyName', async (req, res) => {
  const companyName = req.params.companyName;
  console.log(companyName)
  try {
    // Find the company in the database based on its name
    const companyDetails = await LeadModel.findOne({ companyName });
    console.log(companyDetails)

    // If company is found, update its read status to true
    if (companyDetails) {
      companyDetails.read = true; // Update the read status to true
      // Save the updated company back to the database
      await companyDetails.save();
      res.json(companyDetails); // Send the updated company as the response
    } else {
      // If company is not found, return a 404 error
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


http.listen(3001, function () {
  console.log("Server started...");
  socketIO.on("connection", function (socket) {
    console.log("User connected: " + socket.id);
  });
});

// app.listen(3001,(req,res)=>{
//   console.log("Server is running")
// })
