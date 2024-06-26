var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");

const multer = require("multer");
// const authRouter = require('./helpers/Oauth');
// const requestRouter = require('./helpers/request');

const { sendMail3 } = require("../helpers/sendMail3");
const { sendMail4 } = require("../helpers/sendMail4");

const userModel = require("../models/CompanyBusinessInput.js");




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname and company name
    const companyName = req.params.CompanyName;
    let destinationPath = "";

    if (file.fieldname === "otherDocs") {
      destinationPath = `BookingsDocument/${companyName}/ExtraDocs`;
    } else if (file.fieldname === "paymentReceipt") {
      destinationPath = `BookingsDocument/${companyName}/PaymentReceipts`;
    }
    else if (file.fieldname === "DirectorAdharCard" || file.fieldname === "DirectorPassportPhoto") {
      destinationPath = `ClientDocuments/${companyName}/DirectorDocs`;
    } else {
      destinationPath = `ClientDocuments/${companyName}/OtherDocs`
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

// ******************************************************   Format Dates  ************************************************************************
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


router.post("/basicinfo-form/:CompanyName",

  upload.fields([
    { name: "DirectorPassportPhoto", maxCount: 10 },
    { name: "DirectorAdharCard", maxCount: 10 },
    { name: "UploadMOA", maxCount: 1 },
    { name: "UploadAOA", maxCount: 1 },
    { name: "UploadPhotos", maxCount: 1 },
    { name: "RelevantDocument", maxCount: 1 },
  ]),
  async (req, res) => {

    try {
      const DirectorPassportPhoto = req.files["DirectorPassportPhoto"] || [];
      const DirectorAdharCard = req.files["DirectorAdharCard"] || [];
      const UploadMOA = req.files["UploadMOA"] || [];
      const UploadAOA = req.files["UploadAOA"] || [];
      const UploadPhotos = req.files["UploadPhotos"] || [];
      const RelevantDocument = req.files["RelevantDocument"] || [];






      // Get user details from the request body
      const {
        CompanyName,
        CompanyEmail,
        CompanyNo,
        BrandName,
        WebsiteLink,
        CompanyAddress,
        CompanyPanNumber,
        SelectServices,
        FacebookLink,
        InstagramLink,
        LinkedInLink,
        YoutubeLink,
        CompanyActivities,
        ProductService,
        CompanyUSP,
        ValueProposition,
        TechnologyInvolved,
        DirectInDirectMarket,
        Finance,
        BusinessModel,
        DirectorDetails,
      } = req.body;



      //console.log("select services" , SelectServices)
      // const services = SelectServices.map(service => service);

      // Now join the mapped array to create a comma-separated string
      // const commaSeparatedValues = services.join(", ");
      // console.log("comma" , commaSeparatedValues);


      // Construct the HTML content conditionally
      let facebookHtml = "";
      if (FacebookLink && FacebookLink !== "No Facebook Id") {
        facebookHtml = `
         <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Facebook Id
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${FacebookLink}
              </div>
            </div>
          </div>
        `;
      }

      let instagramHtml = "";
      if (InstagramLink && InstagramLink !== "No Instagram Id") {
        instagramHtml = `
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  Instagram Id
                </div>
              </div>
              <div style="width: 75%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  ${InstagramLink}
                </div>
              </div>
            </div>
          `;
      }

      let linkedInHtml = "";
      if (LinkedInLink && LinkedInLink !== "No LinkedIn Id") {
        linkedInHtml = `
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  LinkedIn Id
                </div>
              </div>
              <div style="width: 75%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  ${LinkedInLink}
                </div>
              </div>
            </div>
          `;
      }

      let youtubeHtml = "";
      if (YoutubeLink && YoutubeLink !== "No YouTube Id") {
        youtubeHtml = `
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  YouTube Id
                </div>
              </div>
              <div style="width: 75%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  ${YoutubeLink}
                </div>
              </div>
            </div>
          `;
      }
      let TechnologyInvolvedHtml = "";
      if (
        TechnologyInvolved &&
        TechnologyInvolved !== "No Technology Invloved"
      ) {
        TechnologyInvolvedHtml = `
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  Technology Involved
                </div>
              </div>
              <div style="width: 75%">
                <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                  ${TechnologyInvolved}
                </div>
              </div>
            </div>
          `;
      }

      let uploadPhotosHtml = "";
      if (UploadPhotos && UploadPhotos !== "No Upload Photos") {
        uploadPhotosHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Upload Photos
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${UploadPhotos}
              </div>
            </div>
          </div>
        `;
      }

      let relevantDocumentsHtml = "";
      if (RelevantDocument && RelevantDocument !== "No Relevant Documents") {
        relevantDocumentsHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Relevant Documents
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${RelevantDocument}
              </div>
            </div>
          </div>
        `;
      }

      let businessModelHtml = "";
      if (BusinessModel && BusinessModel !== "No Business Model") {
        businessModelHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Business Model
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${BusinessModel}
              </div>
            </div>
          </div>
        `;
      }

      let financeDetailsHtml = "";
      if (Finance && Finance !== "No Finance Details") {
        financeDetailsHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Finance Details
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${Finance}
              </div>
            </div>
          </div>
        `;
      }
      let directorLinkedInHtml = "";
      if (LinkedInProfileLink && LinkedInProfileLink !== "No LinkedIn Link") {
        directorLinkedInHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                LinkedIn Profile Link
              </div>
            </div>
            <div style="width: 75%">
              <div style="border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${LinkedInProfileLink}
              </div>
            </div>
          </div>
        `;
      }

      const tempHtml = () => {
        let team = "";
        let isFirstMainDirectorSet = false;
        for (let index = 0; index < DirectorDetails.length; index++) {
          const {
            DirectorName,
            DirectorEmail,
            DirectorMobileNo,
            DirectorQualification,
            DirectorWorkExperience,
            DirectorAnnualIncome,
            LinkedInProfileLink,
            DirectorDesignation,
            DirectorAdharCardNumber,
            DirectorGender,
            IsMainDirector,
          } = DirectorDetails[index];

          // Check if this is the first director and they are marked as the main director

          if (DirectorDetails[index].IsMainDirector === "true") {
            team += `
               <div 
                style="width: 50%;
                margin-bottom: -22px;
                font-weight: bold;
                color: blue;
                margin-left: 20px;">
                  This is the authorised person
                </div>
          `;
            isFirstMainDirectorSet = true;
          }

          team += `
          <div style="width: 95%; margin: 10px auto">
        <div>
            <div style="
              width: 25px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              font-weight: bold;
              color: black;
            ">
                ${index + 1} 
                <div style="
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              font-weight: bold;
              color: black;
            ">

                </div>
            </div>
            <div style="
            background: #f7f7f7;
            padding: 15px;
            border-radius: 10px;
            position: relative;
            margin-top: 15px;
          ">
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                  height: auto;
                ">
                            DirectorName
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorName}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            DirectorEmail
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorEmail}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            DirectorMobileNo
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorMobileNo}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director Qualification
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorQualification}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director Work Experience
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorWorkExperience}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director Annual Income
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorAnnualIncome}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            LinkedIn Profile Link
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${directorLinkedInHtml}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director Designation
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorDesignation}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director AadhaarCard Number
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorAdharCardNumber}
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="width: 25%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            Director Gender
                        </div>
                    </div>
                    <div style="width: 75%">
                        <div style="
                  border: 1px solid #ccc;
                  font-size: 12px;
                  padding: 5px 10px;
                ">
                            ${DirectorGender}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
          `;
        }
        return team;
      };
      const generatedHtml = tempHtml(); // Call the tempHtml function to generate HTML


      // Send Basic-details Admin email-id of  for sendEmail-3.js
      const email = ["nimesh@incscale.in"];
      const subject = CompanyName + " Business Inputs and Basic Information";
      const text = "";
      const html = ` 
         <body>
       <div style="width: 100%; padding: 20px 20px; background: #f6f8fb">
         <h3 style="text-align: center">Basic Details Form</h3>
         <div
           style="
             width: 95%;
             margin: 0 auto;
             padding: 20px 20px;
             background: #fff;
             border-radius: 10px;
           "
         >
           <div style="width: 95%; margin: 10px auto">
             <div style="display: flex; align-items: center; margin-top: 20px; font-size:19px;">
               <div
                 style="
                   width: 30px;
                   height: 30px;
                   line-height: 30px;
                   text-align: center;
                   font-weight: bold;
                   color: black;
                 "
               >
                 1
               </div>
               <div style="margin-left: 10px">Basic Information</div>
             </div>
             <div
               style="
                 background: #f7f7f7;
                 padding: 15px;
                 border-radius: 10px;
                 position: relative;
                 margin-top: 15px;
               "
             >
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Company Name
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyName}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Company Email
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyEmail}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Company No
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyNo}
                   </div>
                 </div>
               </div>
    
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Brand Name
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${BrandName}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Website Link
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${WebsiteLink}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                    Company Address
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyAddress}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Company Pan Number
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyPanNumber}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Select Your Services
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${SelectServices}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 100%">
                   <div>
                   ${facebookHtml}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width:100%">
                   <div>
                    ${instagramHtml}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width:100%">
                   <div>
                   ${linkedInHtml}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width:100%">
                   <div>
                   ${youtubeHtml} 
                   </div>
                 </div>
               </div>
             </div>
           </div>
    
           <div style="width: 95%; margin: 10px auto">
             <div style="display: flex; align-items: center; margin-top: 20px; font-size:19px;">
               <div
                 style="
                   width: 30px;
                   height: 30px;
                   line-height: 30px;
                   text-align: center;
                   font-weight: bold;
                   color: black;
                 "
               >
                 2
               </div>
               <div style="margin-left: 10px">Brief About Your Business</div>
             </div>
             <div
               style="
                 background: #f7f7f7;
                 padding: 15px;
                 border-radius: 10px;
                 position: relative;
                 margin-top: 15px;
               "
             >
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Company Activities
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyActivities}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Problems and Solution
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${ProductService}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     USP
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${CompanyUSP}
                   </div>
                 </div>
               </div>
    
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Value Proposition
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${ValueProposition}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 100%">
                   <div>
                     ${TechnologyInvolvedHtml}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 25%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     Direct/Indirect Competitor
                   </div>
                 </div>
                 <div style="width: 75%">
                   <div
                     style="
                       border: 1px solid #ccc;
                       font-size: 12px;
                       padding: 5px 10px;
                     "
                   >
                     ${DirectInDirectMarket}
                   </div>
                 </div>
               </div>
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 100%">
                   <div>
                     ${businessModelHtml}
                   </div>
                 </div>
               </div>
               
               <div style="display: flex; flex-wrap: wrap">
                 <div style="width: 100%">
                   <div>
                   ${financeDetailsHtml}
                  </div>
                </div>
                </div>
                </div>
              <div style="display: flex; align-items: center; margin-top: 20px; font-size:19px;">
               <div
                 style="
                   width: 30px;
                   height: 30px;
                   line-height: 22px;
                   text-align: center;
                   font-weight: bold;
                   color: black;
                   margin-top:5px;
                 "
               >
                 3
               </div>
               <div style="margin-left: 10px">Directors And Team Details</div>
             </div>
             <div
               style="
                 background: #f7f7f7;
                 padding: 15px;
                 border-radius: 10px;
                 position: relative;
                 margin-top: 15px;
               "
             >
             ${generatedHtml}
          </div>
        </div>
      </body>
       `;

      await sendMail3(
        email,
        subject,
        text,
        html,
        DirectorPassportPhoto,
        DirectorAdharCard,
        UploadMOA,
        UploadAOA,
        UploadPhotos,
        RelevantDocument
      )
        .then((info) => {
          console.log("Email Sent:");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email");
        });


      const details = DirectorDetails.find((details) => details.IsMainDirector === "true");
      const DirectorEmail = details.DirectorEmail


      // Send Thank You Message with pdf Draft sendMaiel4.js 

      const recipients = [CompanyEmail];
      const ccEmail = [DirectorEmail];
      const subject1 = "Thank you for submitting the form!";
      const text1 = "";
      const html1 = `
           <p>Dear Client,</p>
    
    <p>Thank you for submitting the form. We appreciate your cooperation and are excited to begin working on your project for Your Company ${CompanyName}. As a first step, we will provide you with limited content for your pitch deck, which will be created by our team to meet pitch deck standards.</p>
    
    <p>Simultaneously, our graphic designer will work on the visual elements of the pitch deck. Once you approve the content shared by our employee, it will be incorporated into the pitch deck. The final version of the pitch deck will be shared with you in the WhatsApp group for your final approval.</p>
    
    <p>During this time, our financial analyst will reach out to you for financial inputs to create a comprehensive financial projection. The financial projection will be included in the application for the ${SelectServices}</p>
    
    <p>Please note that the entire process, including content creation, graphic design, and financial projection, will take approximately 15 to 20 working days. We strive to deliver high-quality results within this timeframe. However, it's important to mention that any delays in providing information or approvals from your end may affect the delivery timeline.</p>
    
    <p>Once again, we appreciate your trust in our services. Should you have any questions or require further clarification, please feel free to reach out to us through the WhatsApp group or contact our team directly.</p>
    <p>Best regards,</p>
    
    <p>Operation Team </p>
    <p>+91-9998992601</p>
    <p>Start-Up Sahay Private Limited</p>
          `;


      let MainDirectorName;
      let MainDirectorDesignation;
      if (DirectorDetails.length > 1) {
        if (DirectorDetails[0].IsMainDirector === "true") {
          MainDirectorName = DirectorDetails[1].DirectorName
          MainDirectorDesignation = DirectorDetails[1].DirectorDesignation
        } else if (DirectorDetails[1].IsMainDirector === "true") {
          MainDirectorName = DirectorDetails[0].DirectorName
          MainDirectorDesignation = DirectorDetails[0].DirectorDesignation
        } else {
          MainDirectorName = DirectorDetails[0].DirectorName
          MainDirectorDesignation = DirectorDetails[0].DirectorDesignation
        }
      } else {
        MainDirectorName = DirectorDetails[0].DirectorName
        MainDirectorDesignation = DirectorDetails[0].DirectorDesignation
      }



      // Sending email for CompanyEmail 
      let htmlNewTemplate = fs.readFileSync('./helpers/client_mail.html', 'utf-8');
      const client_address = (!CompanyAddress || CompanyAddress == "") ? `<span class="variable_span" style="width: 350px !important; display: inline-block;border-bottom: 1px solid #656565;"></span>` : CompanyAddress;
      //const filePath = path.join(__dirname, './GeneratedDocs/example.docx');
      let forGender = DirectorDetails.find((details) => details.IsMainDirector === "true")
      const todayDate = formatDate(new Date());
      const filedHtml = htmlNewTemplate
        .replace("{{Gender}}", forGender.DirectorGender === "Male" ? "Shri." : "Smt.")
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace("{{DirectorDesignation}}", forGender.DirectorDesignation)
        .replace("{{AadhaarNumber}}", forGender.DirectorAdharCardNumber)
        .replace("{{CompanyName}}", CompanyName)
        .replace("{{CompanyAddress}}", CompanyAddress)
        .replace("{{CompanyPanNumber}}", CompanyPanNumber)
        .replace("{{Gender}}", forGender.DirectorGender === "Male" ? "Shri." : "Smt.")
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace("{{Gender}}", forGender.DirectorGender === "Male" ? "Shri." : "Smt.")
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace("{{DirectorName}}", MainDirectorName)
        .replace("{{DirectorDesignation}}", MainDirectorDesignation)
        .replace("{{today-date}}",todayDate)
        .replace("{{client-address}}",client_address)

      const pdfFilePath = `./Client-GeneratedDocs/${CompanyName}.pdf`;
      const options = {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: './dev/null',
          },
        },
      };

      pdf.create(filedHtml, options).toFile(pdfFilePath, async (err, response) => {
        if (err) {
          console.error('Error generating PDF:', err);
          return res.status(500).send('Error generating PDF');
        } else {
          try {
            setTimeout(() => {
              const servicesArray = Object.values(SelectServices);

              const selectedService = servicesArray.find(service => service === 'Seed Funding Support');
              //const mainBuffer = fs.readFileSync(pdfFilePath);
              const pdfAttachment = {
                filename: 'MITC.pdf', // Replace with actual file name
                path: path.join(__dirname, 'src', 'MITC.pdf') // Adjust the path accordingly
              };

              const mainBuffer = {
                filename: 'LOA.pdf', // Replace with actual file name
                path: path.join(__dirname, '../GeneratedDocs/LOA.pdf') // Adjust the path accordingly
              };

              let clientDocument;
              if (selectedService) {
                clientDocument = [mainBuffer, pdfAttachment]

              } else {
                clientDocument = [pdfAttachment]
                console.log("Service 'Seed Funding Support' not found.");
              }
              sendMail4(
                recipients,
                ccEmail,
                "Letter of Authorization for filing in SISFS Application",
                ``,
                html1,
                clientDocument
              );
            }, 4000);
            //res.status(200).send('Generated Pdf Successfully');
          } catch (error) {
            console.error("Error sending email:", error);
            // No need to send another response here because one was already sent
          }
        }
      });

      const newUser = new userModel({
        ...req.body,
        DirectorPassportPhoto,
        DirectorAdharCard,
        UploadMOA,
        UploadAOA,
        UploadPhotos,
        RelevantDocument,
      });

      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
)

module.exports = router;