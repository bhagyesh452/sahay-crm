var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const FollowUpModel = require("../models/FollowUp");
const adminModel = require('../models/Admin');





function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateNew(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return `${formattedDay}/${formattedMonth}/${year}`;
}


// ****************************************  Projection Section's Hadi *********************************************************

// 1. ADD PROJECTION
router.post("/update-followup", async (req, res) => {
  try {
    const { companyName } = req.body;
    const todayDate = new Date();
    const time = todayDate.toLocaleTimeString();
    const date = todayDate.toLocaleDateString();
    const finalData = { ...req.body, date, time };

   

    // Check if a document with companyName exists
    const existingData = await FollowUpModel.findOne({ companyName });

    if (existingData) {
      // Update existing document
      const previousData = { ...existingData.toObject() };
      //console.log(previousData)
      existingData.history.push({
        modifiedAt: formatDate(Date.now()),
        data: previousData,
      });
      existingData.set(finalData);
      await existingData.save();
      await adminModel.findOneAndUpdate(
        { ename: finalData.ename },
        {
          $set: {
            projectionStatusForToday: "Yes",
            projectionDate: new Date() // Use the current date directly 
          }
        });
      res.status(200).json({ message: "Data updated successfully" });
    } else {
      // Create new document
      const newData = new FollowUpModel(finalData);
      await newData.save();
      res.status(201).json({ message: "New data added successfully" });
    }
  } catch (error) {
    console.error("Error updating or adding data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Delete Projection
router.delete("/delete-followup/:companyName", async (req, res) => {
  try {
    // Extract the company name from the request parameters
    const { companyName } = req.params;

    // Check if a document with the given company name exists
    const existingData = await FollowUpModel.findOne({ companyName });

    if (existingData) {
      // If the document exists, delete it
      await FollowUpModel.findOneAndDelete({ companyName });
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      // If no document with the given company name exists, return a 404 Not Found response
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    // If there's an error during the deletion process, send a 500 Internal Server Error response
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// 3. Read Projections
router.get("/projection-data/:ename", async (req, res) => {
  try {
    const ename = req.params.ename;
    // Fetch data from the FollowUpModel based on the employeeName if provided
    const followUps = await FollowUpModel.find({
      $or: [
        { ename: ename }, // First condition
        { bdeName: ename }, // Second condition
        { bdmName: ename }, // Second condition
        // Add more conditions if needed
      ],
    });

    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error("Error fetching FollowUp data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/projection-data", async (req, res) => {
  try {
    // Fetch all data from the FollowUpModel
    const followUps = await FollowUpModel.find();

    //console.log(query)
    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error("Error fetching FollowUp data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(`/projection-data-company/:companyName`, async (req, res) => {
  const companyName = req.params.companyName;

  try {
    const response = await FollowUpModel.find({
      companyName: companyName
    })
    res.json(response);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }

})

router.post("/followdataexport/", async (req, res) => {
  try {
    const leads = req.body;

    // const leads = await FollowUpModel.find({
    // });

    const csvData = [];
    // Push the headers as the first row
    csvData.push([
      "SR. NO",
      "Employee Name",
      "Company Name",
      "Offered Services",
      "Offered Prize",
      "Expected Amount",
      "Estimated Payment Date",
      "Last Follow Up Date",
      "Remarks",
    ]);

    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const rowData = [
        index + 1,
        lead.ename,
        lead.companyName,
        `"${lead.offeredServices.join(",")}"`,
        lead.offeredPrize,
        lead.totalPayment,
        lead.estPaymentDate,
        lead.lastFollowUpdate,
        lead.remarks,
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=FollowDataToday.csv"
    );

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Send response with CSV data
    // Send response with CSV data
    //console.log(csvString)
    res.status(200).end(csvString);
    // console.log(csvString)
    // Here you're ending the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/post-bdmacceptted-revertbackprojection", async (req, res) => {
  const { cname } = req.params
  try {
    const findData = await FollowUpModel.findOne(cname)
    if (findData) {
      const newData = await FollowUpModel.findByIdAndUpdate(cname, {
        $set: {
          caseType: "Forwarded",
        },
        $unset: {
          bdmName: ""
        }
      })
      res.status(200).save(newData)
    } else {
      res.status(400).json({ error: "Projection does not exist" })
    }

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }

})

router.post(`/post-followup-forwardeddata/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType, bdmName } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
          bdmName: bdmName
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-updaterejectedfollowup/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
        },
        $unset: {
          bdmName: " "
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-followupupdate-bdmaccepted/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;