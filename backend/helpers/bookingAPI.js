var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

router.get('/', async function(req, res, next) {

    try {
        res.status(200).json({ message:"Boom Baam" });

      } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }



  


});

router.get("/:CompanyName", async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
  
      // Check if the company exists in RedesignedDraftModel
      const existingData = await RedesignedDraftModel.findOne({
        "Company Name": companyName,
      });
  
      if (existingData) {
        // If company exists in RedesignedDraftModel, return the data
        return res.json(existingData);
      }
  
      // If company not found in RedesignedDraftModel, search in RedesignedLeadformModel
      const newData = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });
  
      if (!newData) {
        // If company not found in RedesignedLeadformModel, return 404
        return res.status(404).json({ error: "Company not found" });
      }
      const TempDataObject = {
        "Company Name": companyName,
        Step1Status: true,
        Step2Status: true,
        Step3Status: true,
        Step4Status: true,
        Step5Status: true,
        services: newData.services,
        "Company Email": newData["Company Email"],
        "Company Number": newData["Company Number"],
        incoDate: newData.incoDate,
        panNumber: newData.panNumber,
        gstNumber: newData.gstNumber,
        bdeName: newData.bdeName,
        bdeEmail: newData.bdeEmail,
      };
      // Create a new object with the same company name in RedesignedDraftModel
      const createData = await RedesignedDraftModel.create({
        "Company Name": companyName,
        Step1Status: true,
        Step2Status: true,
        Step3Status: true,
        Step4Status: true,
        Step5Status: true,
        services: newData.services,
        "Company Email": newData["Company Email"],
        "Company Number": newData["Company Number"],
        incoDate: newData.incoDate,
        panNumber: newData.panNumber,
        gstNumber: newData.gstNumber,
        bdeName: newData.bdeName,
        bdeEmail: newData.bdeEmail,
      });
      res.json(TempDataObject);
    } catch (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  });


module.exports = router;