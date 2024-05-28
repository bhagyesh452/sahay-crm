var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const CompanyModel = require("../models/Leads");
const RemarksHistory = require("../models/RemarksHistory");
const RecentUpdatesModel = require("../models/RecentUpdates");
const TeamLeadsModel = require("../models/TeamLeads.js");
const { Parser } = require('json2csv');
const { State } = require('country-state-city');

router.post("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus, title, date, time } = req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { Status: newStatus });

    // Create and save a new document in the RecentUpdatesModel collection
    const newUpdate = new RecentUpdatesModel({
      title: title,
      date: date,
      time: time,
    });
    await newUpdate.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/specific-ename-status/:ename/:status", async (req, res) => {
  const ename = req.params.ename;
  const status = req.params.status;

  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    if (status === "complete") {
      const data = await CompanyModel.find({ ename: ename }).lean();

      res.send(data);
      //console.log("Data" ,data)
    } else {
      const data = await CompanyModel.find({
        ename: ename,
        Status: status,
      }).lean();

      res.send(data);
      //console.log("Data" ,data)
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 2. Read a Company
router.get("/leads/:companyName", async (req, res) => {
  const companyName = req.params.companyName;
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.findOne({
      "Company Name": companyName,
    }).lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Update a Company 
router.put("/leads/:id", async (req, res) => {
  const id = req.params.id;
  //req.body["Company Incorporation Date  "] = new Date(req.body["Company Incorporation Date  "]);

  try {
    req.body["Company Incorporation Date  "] = new Date(
      req.body["Company Incorporation Date "]
    );
    const updatedData = await CompanyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatedData);

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 4. Delete a Company
router.delete("/leads/:id", async (req, res) => {
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

// 6. ADD Multiple Companies(Pata nai kyu he)
router.post("/leads", async (req, res) => {
  const csvData = req.body;
  //console.log("csvdata" , csvData)
  let counter = 0;
  let successCounter = 0;
  let duplicateEntries = []; // Array to store duplicate entries

  try {
    for (const employeeData of csvData) {
      //console.log("employee" , employeeData)
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
          "Company Name": employeeData["Company Name"].toUpperCase(),
        };
        const employee = new CompanyModel(employeeWithAssignData);
        //console.log("newemployee" , employee)
        const savedEmployee = await employee.save();
        //console.log("saved" , savedEmployee)
        successCounter++;
      } catch (error) {
        duplicateEntries.push(employeeData);
        //console.log("kuch h ye" , duplicateEntries);
        console.error("Error saving employee:", error.message);
        counter++;
      }
    }
    if (duplicateEntries.length > 0) {
      //console.log("yahan chala csv pr")
      //console.log(duplicateEntries , "duplicate")
      const json2csvParser = new Parser();
      // If there are duplicate entries, create and send CSV
      const csvString = json2csvParser.parse(duplicateEntries);
      // console.log(csvString , "csv")
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=DuplicateEntries.csv"
      );
      res.status(200).end(csvString);

      //console.log("csvString" , csvString)
    } else {
      // console.log("yahan chala counter pr")
      res.status(200).json({
        message: "Data sent successfully",
        counter: counter,
        successCounter: successCounter,
      });

    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

// 7. Read Muultiple Companies 
router.get("/leads", async (req, res) => {
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.find().lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//8. Read Multiple companies New
router.get('/new-leads', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Items per page
    const skip = (page - 1) * limit; // Number of documents to skip
    const { dataStatus, sort, sortPattern } = req.query;
    //console.log(sort)
    // Query the database to get paginated data
    let query = {};

    if (dataStatus === "Unassigned") {
      query = { ename: "Not Alloted" };
    } else if (dataStatus === "Assigned") {
      query = { ename: { $ne: "Not Alloted" } };
    }

    let sortQuery = {};
    if (sort && sortPattern === 'IncoDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { "Company Incorporation Date  ": 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { "Company Incorporation Date  ": -1 }; // Sort in descending order by Company Incorporation Date
      }
    } else if (sort && sortPattern === 'AssignDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { AssignDate: 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { AssignDate: -1 }; // Sort in descending order by Company Incorporation Date
      }
    }

    let employees;
    if (Object.keys(sortQuery).length !== 0) {
      employees = await CompanyModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit).lean();
    } else {
      employees = await CompanyModel.find(query)
        .sort({ AssignDate: -1 }) // Default sorting in descending order by AssignDate
        .skip(skip)
        .limit(limit).lean();
    }

    // Get total count of documents for pagination
    const unAssignedCount = await CompanyModel.countDocuments({ ename: "Not Alloted" });
    const assignedCount = await CompanyModel.countDocuments({ ename: { $ne: "Not Alloted" } });
    const totalCount = await CompanyModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated data along with pagination metadata
    res.json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      unAssignedCount: unAssignedCount,
      assignedCount: assignedCount
    });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//---------api for sorting according to inco date----------------------

router.get("/sort-leads-inco-date", async (req, res) => {
  const { sortBy } = req.query;
  console.log(sortBy); // Check if sortBy is correctly received

  try {
    let sortQuery = {};

    switch (sortBy) {
      case "ascending":
        sortQuery = { ['Company Incorporation Date  ']: 1 }; // Sort by company incorporation date in ascending order
        console.log("ascending chala");
        break;

      case "descending":
        sortQuery = { ['Company Incorporation Date  ']: -1 }; // Sort by company incorporation date in descending order
        console.log("descending chala");
        break;

      case "none":
        // Do nothing for none, return data as is
        console.log("none chala");
        break;

      default:
        // Handle default case if sortBy is not recognized
        console.log("Invalid sortBy value");
        break;
    }

    // Query the database with sorting applied
    const sortedData = await CompanyModel.find().sort(sortQuery).limit(500).lean();

    // Return sorted data
    res.json({ data: sortedData });
  } catch (error) {
    console.error('Error fetching sorted data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//-------------------api to filter leads-----------------------------------
router.get('/filter-leads', async (req, res) => {
  const { selectedStatus, selectedState, selectedNewCity, selectedBDEName ,selectedAssignDate } = req.query;
  try {
    let query = {};

    if (selectedStatus) {
      if (selectedStatus === 'Not Picked Up' ||
          selectedStatus === 'Busy' ||
          selectedStatus === 'Junk' ||
          selectedStatus === 'Not Interested' ||
          selectedStatus === 'Untouched' ||
          selectedStatus === 'Interested' ||
          selectedStatus === 'Matured' ||
          selectedStatus === 'FollowUp') {
        query.Status = selectedStatus;
      } 
    }

    if (selectedState) {
      if (!query.Status) {
        query.State = selectedState;
      } else {
        query = { Status: selectedStatus, State: selectedState };
      }
    }

    if (selectedNewCity) {
      if (!query.Status || !query.State) {
        query.City = selectedNewCity;
      } else {
        query = { Status: selectedStatus, State: selectedState, City: selectedNewCity };
      }
    }

    if(selectedBDEName && selectedBDEName.trim() !== ''){
      
      if(!query.Status || !query.State || !query.City){
        query.ename = selectedBDEName
      }else{
        query = { Status: selectedStatus, State: selectedState, City: selectedNewCity , ename:selectedBDEName };
      }
    }

    if(selectedAssignDate){
      const startDate = new Date(selectedAssignDate);
      const endDate = new Date(selectedAssignDate);
      endDate.setDate(endDate.getDate() + 1);
      if(!query.Status || !query.State || !query.City || !query.ename){
        query.AssignDate = {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString()
        };
      }else{
        query = { Status: selectedStatus, State: selectedState, City: selectedNewCity , ename:selectedBDEName , AssignDate:selectedAssignDate };
      }
    }

    console.log(query);

    const employees = await CompanyModel.find(query).limit(500).lean();
    res.status(200).json(employees);

  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





//9. Filtere search for Reading Multiple Companies
router.get('/search-leads', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const { field } = req.query;
    //console.log(searchQuery , "search")

    let searchResults;
    if (field === "Company Name" || field === "Company Email") {
      if (searchQuery && searchQuery.trim() !== '') {
        // Perform database query to search for leads matching the searchQuery
        const query = {};
        query[field] = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search
        
        searchResults = await CompanyModel.find(query).limit(500).lean();
      } else {
        // If search query is empty, fetch 500 data from CompanyModel
        searchResults = await CompanyModel.find().limit(500).lean();
      }
    }
    else if (field === "Company Number") {
      if (searchQuery && searchQuery.trim() !== '') {
        // Check if the searchQuery is a valid number
        const searchNumber = Number(searchQuery);

        if (!isNaN(searchNumber)) {
          // Perform database query to search for leads matching the searchQuery as a number
          searchResults = await CompanyModel.find({
            'Company Number': searchNumber
          }).limit(500).lean();
        } else {
          // If the searchQuery is not a number, perform a regex search (if needed for some reason)
          searchResults = await CompanyModel.find({
            'Company Number': { $regex: new RegExp(searchQuery) } // Case-insensitive search
          }).limit(500).lean();
        }
      } else {
        // If search query is empty, fetch 500 data from CompanyModel
        searchResults = await CompanyModel.find().limit(500).lean();
      }
    }
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//10. Search for Specific Company
router.get("/specific-company/:companyId", async (req, res) => {
  try {
    const companyId = req.params.companyId;
    // Assuming CompanyModel.findById() is used to find a company by its ID
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



//11. Assign company to new employee
router.post("/assign-new", async (req, res) => {
  const { data } = req.body;
  const { ename } = req.body;
  //console.log("data" , data)
  //console.log("ename" , ename
  try {
    // Add AssignDate property with the current date
    for (const employeeData of data) {
      //console.log("employee" , employeeData)
      try {
        const companyName = employeeData["Company Name"];
        const employee = await CompanyModel.findOneAndUpdate({ "Company Name": companyName }, { $set: { ename: ename } });
        //console.log("yahan kuch locha h" , employee)
        const deleteTeams = TeamLeadsModel.findByIdAndDelete(employee._id);
        //console.log("newemployee" , employee)
        await RemarksHistory.deleteOne({ companyID: employee._id });

        //console.log("saved" , savedEmployee)

      } catch (error) {

        //console.log("kuch h ye" , duplicateEntries);
        console.error("Error Assigning Data:", error.message);

      }
    }
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(`/post-bdenextfollowupdate/:id`, async (req, res) => {
  const companyId = req.params.id;
  const bdeNextFollowUpDate = new Date(req.body.bdeNextFollowUpDate);
  //console.log(bdeNextFollowUpDate);
  try {
    await CompanyModel.findByIdAndUpdate(companyId, {
      bdeNextFollowUpDate: bdeNextFollowUpDate,
    });

    res.status(200).json({ message: "Date Updated successfully" });
  } catch (error) {
    console.error("Error fetching Date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;

    // Fetch data from companyModel where ename matches employeeName
    const data = await CompanyModel.find({
      $or: [
        { ename: employeeName },
        { maturedBdmName: employeeName },
        { multiBdmName: { $in: [employeeName] } },
      ],
    });
    //console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/newcompanyname/:id", async (req, res) => {
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

router.get("/card-leads", async (req, res) => {
  try {
    const { dAmount } = req.query; // Get the dAmount parameter from the query

    // Fetch data from the database with the specified limit
    const data = await CompanyModel.find({
      ename: { $in: ["Select Employee", "Not Alloted"] },
    })
      .limit(parseInt(dAmount))
      .lean();

    // Send the data as the API response
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/edata-particular/:ename", async (req, res) => {
  try {
    const { ename } = req.params;
    const filteredEmployeeData = await CompanyModel.find({
      $or: [{ ename: ename }, { maturedBdmName: ename }],
    });
    res.json(filteredEmployeeData);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;