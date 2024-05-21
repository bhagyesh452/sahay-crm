var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();

const TeamModel = require("./models/TeamModel.js");

router.get("/teaminfo", async (req, res) => {
    try {
      const data = await TeamModel.find();
      //console.log("teamdata" , data)
      res.json(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.get("/teaminfo/:ename", async (req, res) => {
    const ename = req.params.ename;
    //console.log(ename)
    //console.log(ename)
    try {
      // Fetch data using lean queries to retrieve plain JavaScript objects
      const data = await TeamModel.findOne({
        "employees.ename": ename, // Using dot notation to query field inside array of objects
      }).lean();
  
      res.send(data);
      //console.log("ename wala data" ,data)
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/teaminfo", async (req, res) => {
    const teamData = req.body;
    // Assuming `formatDate()` is a function that formats the current date
  
    try {
      const newTeam = await TeamModel.create({
        modifiedAt: formatDate(Date.now()),
        ...teamData,
      });
      //console.log("newTeam", newTeam);
      res.status(201).json(newTeam);
    } catch (error) {
      console.error("Error creating team:", error.message);
      if (teamData.teamName === "") {
        return res.status(500).json({ message: "Please Enter Team Name" });
      } else {
        return res.status(500).json({ message: "Duplicate Entries Found" });
      }
    }
  });
  
  

  module.exports = router;