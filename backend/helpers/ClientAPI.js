var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
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
const {
  clouddebugger,
} = require("googleapis/build/src/apis/clouddebugger/index.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname and company name
    const companyName = req.params.CompanyName;
    let destinationPath = "";

    if (file.fieldname === "otherDocs") {
      destinationPath = `BookingsDocument/${companyName}/ExtraDocs`;
    } else if (file.fieldname === "paymentReceipt") {
      destinationPath = `BookingsDocument/${companyName}/PaymentReceipts`;
    } else if (
      file.fieldname === "DirectorAdharCard" ||
      file.fieldname === "DirectorPassportPhoto"
    ) {
      destinationPath = `Client/ClientDocuments/${companyName}/DirectorDocs`;
    } else {
      destinationPath = `Client/ClientDocuments/${companyName}/OtherDocs`;
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

router.post(
  "/basicinfo-form/:CompanyName",

  upload.fields([
    { name: "DirectorPassportPhoto", maxCount: 10 },
    { name: "DirectorAdharCard", maxCount: 10 },
    { name: "UploadMOA", maxCount: 1 },
    { name: "UploadAOA", maxCount: 1 },
    { name: "UploadPhotos", maxCount: 1 },
    { name: "RelevantDocument", maxCount: 1 },
    { name: "UploadAuditedStatement", maxCount: 1 },
    { name: "UploadProvisionalStatement", maxCount: 1 },
    { name: "UploadDeclaration", maxCount: 1 },
    { name: "UploadRelevantDocs", maxCount: 1 },
  ]),

  async (req, res) => {
    try {
      const DirectorPassportPhoto = req.files["DirectorPassportPhoto"] || [];
      const DirectorAdharCard = req.files["DirectorAdharCard"] || [];
      const UploadMOA = req.files["UploadMOA"] || [];
      const UploadAOA = req.files["UploadAOA"] || [];
      const UploadPhotos = req.files["UploadPhotos"] || [];
      const RelevantDocument = req.files["RelevantDocument"] || [];
      const UploadAuditedStatement = req.files["UploadAuditedStatement"] || [];
      const UploadProvisionalStatement =
        req.files["UploadProvisionalStatement"] || [];
      const UploadDeclaration = req.files["UploadDeclaration"] || [];
      const UploadRelevantDocs = req.files["UploadRelevantDocs"] || [];

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
        SocialMedia,
        FacebookLink,
        InstagramLink,
        LinkedInLink,
        YoutubeLink,
        CompanyActivities,
        ProductService,
        CompanyUSP,
        ValueProposition,
        TechnologyInvolved,
        TechnologyDetails,
        RelevantDocumentComment,
        DirectInDirectMarket,
        Finance,
        FinanceCondition,
        BusinessModel,
        DirectorDetails,
      } = req.body;

      // Social Media code
      let SocialMediaResponse = SocialMedia;
      let SocialMediaHTML = "";
      if (SocialMedia === "Yes") {
        SocialMediaHTML = `
                    <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;">Facebook</div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <div style="height: 100%;font-size:12px;">${FacebookLink}</div>
                        </div>
                    </div> 
                    <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;">Instagram</div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <div style="height: 100%;font-size:12px;">${InstagramLink}</div>
                        </div>
                    </div> 
                    <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;">LinkedIn</div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <div style="height: 100%;font-size:12px;">${LinkedInLink}</div>
                        </div>
                    </div> 
                    <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;">Youtube</div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <div style="height: 100%;font-size:12px;">${YoutubeLink}</div>
                        </div>
                    </div> 
        `;
      }

      // UploadMOA for Email response with file Name code
      const MOA_response = UploadMOA && UploadMOA.length !== 0 ? "Yes" : "No";
      let MOA_condition = "";

      if (UploadMOA && UploadMOA.length !== 0) {
        MOA_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Upload MOA</div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${UploadMOA[0].originalname}</div>
              </div>
          </div> 
        `;
      }

      // UploadAOA for Email response with file Name code
      const AOA_response = UploadAOA && UploadAOA.length !== 0 ? "Yes" : "No";
      let AOA_condition = "";

      if (UploadAOA && UploadAOA.length !== 0) {
        AOA_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Upload AOA</div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${UploadAOA[0].originalname}</div>
              </div>
          </div> 
        `;
      }

      // Any Kind Of Technology Is Involved In Your Product Or Service code
      let TechInvolvedResponse = TechnologyInvolved ? "Yes" : "No";
      let TechnologyInvolvedHtml = "";
      if (TechInvolvedResponse === "Yes") {
        TechnologyInvolvedHtml = `
          <div style="display: flex; margin-top: 8px;">
            <div style="width: 30%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">Add Details About Technology Involved</div>
            </div>
            <div style="width: 70%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">${TechnologyDetails}</div>
            </div>
          </div>
        `;
      }

      // Do You Have Upload Photos of Product or Service code
      const logoCondition = UploadPhotos.length !== 0 ? "Yes" : "No";


      let UploadPhotos_condition = "";
      if (UploadPhotos && UploadPhotos.length !== 0) {
        UploadPhotos_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Upload Photos of LOGO Or Product/Prototype </div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${UploadPhotos[0].originalname}</div>
              </div>
          </div>
        `;
      }

      // Any IP Field code
      let AnyIpFiledResponse =
        RelevantDocument && RelevantDocument.length !== 0 ? "Yes" : "No";
      let RelevantDocumentHtml = "";
      if (AnyIpFiledResponse === "Yes") {
        RelevantDocumentHtml = `
          <div style="display: flex; margin-top: 8px;">
            <div style="width: 30%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">Provide The Option to Upload the Relevant Document Comment</div>
            </div>
            <div style="width: 70%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">${RelevantDocumentComment}</div>
            </div>
          </div>
        `;
      }

      // let UploadRelevant_condition = RelevantDocument.length !== 0 ? "Yes" : 'No';
      let UploadRelevant_condition = "";
      if (RelevantDocument && RelevantDocument.length !== 0) {
        UploadRelevant_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Provide The Option to Upload the Relevant Document</div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${RelevantDocument[0].originalname}</div>
              </div>
          </div>
        `;
      }

      // Do You have ITR Filled for Previous Year code
      const ITR_response =
        UploadAuditedStatement && UploadAuditedStatement.length !== 0
          ? "Yes"
          : "No";
      let ITR_condition = "";
      let ITR_Document_Link = "";
      if (UploadAuditedStatement && UploadAuditedStatement.length !== 0) {
        ITR_condition = ` <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;"> Upload Audited Profit & Loss and Balance Sheet Statement </div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <!-- file link -->
                            <div style="height: 100%;font-size:12px;">${UploadAuditedStatement[0].originalname}</div>
                        </div>
                    </div>`;
      } else if (
        UploadProvisionalStatement &&
        UploadProvisionalStatement.length !== 0
      ) {
        ITR_condition = ` <div style="display: flex;margin-top: 8px;">
                        <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                            <div style="height: 100%;font-size:12px;"> Upload Provisional Statement or Accounts report till date for Projection</div>
                        </div>
                        <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                            <!-- file link -->
                            <div style="height: 100%;font-size:12px;">${UploadProvisionalStatement[0].originalname}</div>
                        </div>
                    </div>`;
      }

      // Have You Raised Any Financing Thus Far (Grants, Loans, Investments, Friends And Family, Etc.) code
      let FinanceHtml = "";
      if (FinanceCondition === "Yes") {
        FinanceHtml = `
          <div style="display: flex; margin-top: 8px;">
            <div style="width: 30%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">Provide The Option to Mentioned The Same and Explain</div>
            </div>
            <div style="width: 70%; align-self: stretch; border: 1px solid #ccc; padding: 8px; background: #fff;">
              <div style="height: 100%; font-size: 12px;">${Finance}</div>
            </div>
          </div>
        `;
      }

      // Upload Declaration code
      const UploadDeclaration_response =
        UploadDeclaration && UploadDeclaration.length !== 0 ? "Yes" : "No";
      let UploadDeclaration_condition = "";

      if (UploadDeclaration && UploadDeclaration.length !== 0) {
        UploadDeclaration_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Upload Declaration</div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${UploadDeclaration[0].originalname}</div>
              </div>
          </div> 
        `;
      }

      // Upload Relevant Docs code
      const UploadRelevantDocs_response =
        UploadRelevantDocs && UploadRelevantDocs.length !== 0 ? "Yes" : "No";
      let UploadRelevantDocs_condition = "";

      if (UploadRelevantDocs && UploadRelevantDocs.length !== 0) {
        UploadRelevantDocs_condition = `
          <div style="display: flex;margin-top: 8px;">
              <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                  <div style="height: 100%;font-size:12px;">Upload Relevant Docs</div>
              </div>
              <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                  <div style="height: 100%;font-size:12px;">${UploadRelevantDocs[0].originalname}</div>
              </div>
          </div> 
        `;
      }

      let uploadPhotosHtml = "";
      if (UploadPhotos && UploadPhotos !== "No Upload Photos") {
        uploadPhotosHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%;align-self: stretch;height:100%;border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                Upload Photos
            </div>
            <div style="width: 75%;align-self: stretch;height:100%;border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
                ${UploadPhotos}
            </div>
          </div>
        `;
      }

      let businessModelHtml = "";
      if (BusinessModel && BusinessModel !== "No Business Model") {
        businessModelHtml = `
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 25%;align-self: stretch;height:100%;border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
            
                Business Model
              
            </div>
            <div style="width: 75%;align-self: stretch;height:100%;border: 1px solid #ccc; font-size: 12px; padding: 5px 10px;">
            
                ${BusinessModel}
              
            </div>
          </div>
        `;
      }

      // DirectorDetails code Start
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

          console.log(`Director ${index + 1} details:`, DirectorDetails[index]);

          if (IsMainDirector === "true") {
            isFirstMainDirectorSet = true;
          }

          team += `
                <!--Card For Brief About Your Business-->
                    <div style="border: 1px solid #ccc;background: #f4f4f4;padding: 15px;border-radius: 10px;margin-top: 10px;">
                          <div>
                              <h3 style="margin: 0px;">Directors Details</h3>
                          </div>
                    <div>
                        <div style="display: flex; justify-content: space-between;margin-top: 8px;margin-bottom: 8px;">
                            <div>Director ${index + 1}</div>
                            <div> ${IsMainDirector === "true"
              ? "Authorized Person"
              : ""
            } </div>
                        </div>
                        <div>
                              <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Enter Director's Name *</div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorName}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Enter Director's Email </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorEmail}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Enter Director's Mobile No </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorMobileNo}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Enter Director's Qualification </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorQualification}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Director's Work Experience (In Detail) </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorWorkExperience}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Annual Income Of Director's Family (Approx) </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorAnnualIncome}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Director's Passport Size Photo</div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorPassportPhoto[index].originalname
            }</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Director's Aadhaar Card </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorAdharCard[index].originalname
            }</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Director's Aadhaar Number </div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorAdharCardNumber}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Director's Designation</div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorDesignation}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">Choose Director's Gender</div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${DirectorGender}</div>
                                </div>
                            </div>
                            <div style="display: flex;">
                                <div style="width: 30%;align-self: stretch;border: 1px solid #ccc; padding: 8px; background: #fff;">
                                    <div style="height: 100%;font-size:12px;">LinkedIn Profile Link</div>
                                </div>
                                <div style="width: 70%;align-self: stretch;border: 1px solid #ccc; padding: 8px;background: #fff;">
                                    <div style="height: 100%;font-size:12px;">${LinkedInProfileLink}</div>
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
      let sendMain3HTML = fs.readFileSync(
        "./helpers/input-responce.html",
        "utf-8"
      );

      // UploadPhotos & Logo condition code


      let finalHTML = sendMain3HTML;

      // Send Basic-details Admin email-id of  for sendEmail-3.js
      const email = ["support@startupsahay.com"];
      const subject = CompanyName + " Business Inputs and Basic Information";
      const text = "";
      const html = finalHTML
        .replace("{{CompanyName}}", CompanyName)
        .replace("{{CompanyEmail}}", CompanyEmail)
        .replace("{{CompanyNo}}", CompanyNo)
        .replace("{{BrandName}}", BrandName)
        .replace("{{WebsiteLink}}", WebsiteLink)
        .replace("{{CompanyAddress}}", CompanyAddress)
        .replace("{{CompanyPanNumber}}", CompanyPanNumber)
        .replace("{{SelectServices}}", SelectServices)
        .replace("{{SocialMediaResponse}}", SocialMediaResponse)
        .replace("{{SocialMedia_Conditional}}", SocialMediaHTML)
        .replace("{{CompanyActivities}}", CompanyActivities)
        .replace("{{ProductService}}", ProductService)
        .replace("{{CompanyUSP}}", CompanyUSP)
        .replace("{{ValueProposition}}", ValueProposition)
        .replace("{{TechInvolvedResponse}}", TechInvolvedResponse)
        .replace("{{TechnologyInvolvedHtml}}", TechnologyInvolvedHtml)
        .replace("{{AnyIpFiledResponse}}", AnyIpFiledResponse)
        .replace("{{RelevantDocumentHtml}}", RelevantDocumentHtml)
        .replace("{{UploadRelevant_condition}}", UploadRelevant_condition)
        .replace("{{UploadPhotos_condition}}", UploadPhotos_condition)
        // .replace("{{logoOrProduct_condition}}", logoOrProduct_condition )
        .replace("{{DirectInDirectMarket}}", DirectInDirectMarket)
        .replace("{{ITR_Condition}}", ITR_response)
        .replace("{{MOA_response}}", MOA_condition)
        .replace("{{AOA_response}}", AOA_condition)
        .replace("{{ITR_Document_Link}}", ITR_condition)
        .replace("{{BusinessModel}}", BusinessModel)
        .replace("{{FinanceResponse}}", FinanceCondition)
        .replace("{{FinanceHtml}}", FinanceHtml)
        .replace("{{UploadDeclaration_condition}}", UploadDeclaration_condition)
        .replace(
          "{{UploadRelevantDocs_condition}}",
          UploadRelevantDocs_condition
        )
        .replace("{{Logo_Condition}}", logoCondition)
        .replace("{{generatedHtml}}", generatedHtml);

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
        RelevantDocument,
        UploadAuditedStatement,
        UploadProvisionalStatement,
        UploadDeclaration,
        UploadRelevantDocs
      )
        .then((info) => {
          console.log("Email Sent:");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email");
        });

      const details = DirectorDetails.find(
        (details) => details.IsMainDirector === "true"
      );
      const DirectorEmail = details.DirectorEmail;




      // Seed Funding Support with Attachment of LOA & MITC Both Service on Subject
      const servicesArrayForSendMail4 = Object.values(SelectServices);
      const selectedServiceToShow = servicesArrayForSendMail4.find(
        (service) => service === "Seed Funding Support"
      );
      let subjectForSendMail4;
      if (selectedServiceToShow) {
        subjectForSendMail4 = `${CompanyName} | LOA & MITC`;
      } else {
        subjectForSendMail4 = `${CompanyName} | MITC`;
      }



      // function Pitch Deck Development Service
      const servicesArrayForPitchDeckServiceSendMail5 = Object.values(SelectServices);
      const selectedServicePitch = servicesArrayForPitchDeckServiceSendMail5.find(
        (service) => service === "Pitch Deck Development "
      );
      console.log(servicesArrayForPitchDeckServiceSendMail5);
      console.log("SELECTED", selectedServicePitch);



      // function Income Tax Exemption Service
      const servicesArrayForIncomeTaxExemptionSendMail6 = Object.values(SelectServices);
      const selectedServiceIncome = servicesArrayForIncomeTaxExemptionSendMail6.find(
        (service) => service === "Income Tax Exemption"
      );
      console.log(servicesArrayForIncomeTaxExemptionSendMail6);
      console.log("SELECTED", selectedServiceIncome);




      // Send Thank You Message with pdf Draft sendMaiel4.js
      const recipients = [CompanyEmail];
      const ccEmail = [DirectorEmail];
      const subject1 = subjectForSendMail4;
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

      // html2 code for Pitch Deck Development Service Select Then Sending the email draft on CompanyEmail
      const html2 = `
          <p>Dear Client,</p>

          <p>Thank you for submitting the form. We appreciate your cooperation and are excited to begin working on your project for ${CompanyName}. As a first step, we will provide you with the content for your pitch deck, which will be created by our team to meet pitch deck standards.</p>

          <p>Once you approve the content shared by our team members, our graphic designer will start working on the visual elements of the pitch deck. The final version of the pitch deck will then be shared with you in the WhatsApp group for your final approval.</p>

          <p>Please note that the entire process, including content creation and graphic design, will take approximately 15 to 20 working days. We strive to deliver high-quality results within this timeframe. However, it's important to mention that any delays in providing information or approvals from your end may affect the delivery timeline.</p>

          <p>Once again, we appreciate your trust in our services. Should you have any questions or require further clarification, please feel free to reach out to us through the WhatsApp group or contact our team directly.</p>

          <p>Best regards,</p>

          <p>Operations Team</p>
          <p>Start-Up Sahay Private Limited</p>
          <p>+91-9998992601</p>
    `;

      // html3 code for Income Tax Exemption Service Then Sending the email draft on CompanyEmail
      const html3 = `
          <p>Dear Client,</p>

          <p>Thank you for submitting the form. We appreciate your cooperation and are excited to begin working on your Income Tax Exemption service for ${CompanyName}. As a first step, we will provide you the content draft for your pitch deck, which will be created by our team to meet the required standards.</p>
          
          <p>Once you approve the content shared by our team members, our graphic designer will start working on the visual elements of the pitch deck. After the design is finalized, the complete pitch deck will be shared with you in the WhatsApp group for your final approval.</p>
          
          <p>Upon receiving your approval, we will proceed to submit the pitch deck and other required documents to the concerned department on your behalf.</p>
          
          <p>Meanwhile, our team will get in touch with you if any additional documents are required to complete the application process.</p>
          
          <p>Please note that the entire process, including content creation, graphic design, and submission to the concerned department, will take approximately 15 to 20 working days. We strive to deliver high-quality results within this timeframe. However, it's important to mention that any delays in providing information or approvals from your end may affect the delivery timeline.</p>

          <P>Once again, we appreciate your trust in our services. Should you have any questions or require further clarification, please feel free to reach out to us through the WhatsApp group or contact our team directly.</P>
          
          <p>Best regards,</p>
          <p>Operation Team</p>
          <p>+91-9998992601</p>
          <p>Start-Up Sahay Private Limited</p>
        `;



      // Condition for html1 html2 & html3 code
      let htmlToSend;
      if (selectedServiceIncome !== undefined && selectedServiceIncome !== null && selectedServiceIncome !== "") {
        htmlToSend = html3;
      } else if (selectedServicePitch !== undefined && selectedServicePitch !== null && selectedServicePitch !== "") {
        htmlToSend = html2;
      } else {
        htmlToSend = html1;
      }




      let MainDirectorName;
      let MainDirectorDesignation;
      if (DirectorDetails.length > 1) {
        if (DirectorDetails[0].IsMainDirector === "true") {
          MainDirectorName = DirectorDetails[1].DirectorName;
          MainDirectorDesignation = DirectorDetails[1].DirectorDesignation;
        } else if (DirectorDetails[1].IsMainDirector === "true") {
          MainDirectorName = DirectorDetails[0].DirectorName;
          MainDirectorDesignation = DirectorDetails[0].DirectorDesignation;
        } else {
          MainDirectorName = DirectorDetails[0].DirectorName;
          MainDirectorDesignation = DirectorDetails[0].DirectorDesignation;
        }
      } else {
        MainDirectorName = DirectorDetails[0].DirectorName;
        MainDirectorDesignation = DirectorDetails[0].DirectorDesignation;
      }

      // Sending email for CompanyEmail
      let htmlNewTemplate = fs.readFileSync(
        "./helpers/client_mail.html",
        "utf-8"
      );
      const client_address =
        !CompanyAddress || CompanyAddress == ""
          ? `
              <span class="variable_span" 
                    style="width: 473px; display: inline-block;border-bottom: 1px solid #656565;padding-bottom: 4px;height:10px;
              "></span><br>
              <span class="variable_span" 
                    style="width: 280px; display: inline-block;border-bottom: 1px solid #656565;padding-bottom: 4px;height:10px;
              "></span>

              `
          : CompanyAddress;
      //const filePath = path.join(__dirname, './GeneratedDocs/example.docx');
      let forGender = DirectorDetails.find(
        (details) => details.IsMainDirector === "true"
      );
      const todayDate = formatDate(new Date());
      const filedHtml = htmlNewTemplate
        .replace(
          "{{Gender}}",
          forGender.DirectorGender === "Male" ? "Shri." : "Smt."
        )
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace("{{DirectorDesignation}}", forGender.DirectorDesignation)
        .replace("{{AadhaarNumber}}", forGender.DirectorAdharCardNumber)
        .replace("{{CompanyName}}", CompanyName)
        .replace("{{CompanyAddress}}", CompanyAddress)
        .replace("{{CompanyPanNumber}}", CompanyPanNumber)
        .replace(
          "{{Gender}}",
          forGender.DirectorGender === "Male" ? "Shri." : "Smt."
        )
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace(
          "{{Gender}}",
          forGender.DirectorGender === "Male" ? "Shri." : "Smt."
        )
        .replace("{{DirectorName}}", forGender.DirectorName)
        .replace("{{DirectorName}}", MainDirectorName)
        .replace("{{DirectorDesignation}}", MainDirectorDesignation)
        .replace("{{today-date}}", todayDate)
        .replace("{{today-date}}", todayDate)
        .replace("{{client-address}}", client_address);

      const pdfFilePath = `Client/GeneratedLOA/${CompanyName}.pdf`;
      const options = {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "./dev/null",
          },
        },
      };

      pdf
        .create(filedHtml, options)
        .toFile(pdfFilePath, async (err, response) => {
          if (err) {
            console.error("Error generating PDF:", err);
            return res.status(500).send("Error generating PDF");
          } else {
            try {
              setTimeout(() => {
                const servicesArray = Object.values(SelectServices);

                const selectedService = servicesArray.find(
                  (service) => service === "Seed Funding Support"
                );
                //const mainBuffer = fs.readFileSync(pdfFilePath);
                const pdfAttachment = {
                  filename: "MITC.pdf", // Replace with actual file name
                  path: path.join(__dirname, "src", "MITC.pdf"), // Adjust the path accordingly
                };

                const mainBuffer = {
                  filename: "LOA.pdf", // Replace with actual file name
                  path: path.join(
                    __dirname,
                    `../Client/GeneratedLOA/${CompanyName}.pdf`
                  ), // Adjust the path accordingly
                };

                let clientDocument;
                if (selectedService) {
                  clientDocument = [mainBuffer, pdfAttachment];
                } else {
                  clientDocument = [pdfAttachment];
                  console.log("Service 'Seed Funding Support' not found.");
                }
                sendMail4(
                  recipients,
                  ccEmail,
                  subject1,
                  text1,
                  htmlToSend,
                  clientDocument
                ).then(() => {
                  console.log("Email sent successfully");
                }).catch((error) => {
                  console.error("Error sending email:", error);
                });;
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
        isFormSubmitted: true,
        DirectorDetails: req.body.DirectorDetails.map((director, index) => ({
          ...director,
          DirectorPassportPhoto: DirectorPassportPhoto[index],
          DirectorAdharCard: DirectorAdharCard[index],
        })),
        UploadMOA,
        UploadAOA,
        UploadPhotos,
        RelevantDocument,
        UploadAuditedStatement,
        UploadProvisionalStatement,
        UploadDeclaration,
        UploadRelevantDocs,
      });

      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
);

router.put(
  "/basicinfo-form/:id",
  upload.fields([
    { name: "DirectorPassportPhoto", maxCount: 10 },
    { name: "DirectorAdharCard", maxCount: 10 },
    { name: "UploadMOA", maxCount: 1 },
    { name: "UploadAOA", maxCount: 1 },
    { name: "UploadPhotos", maxCount: 1 },
    { name: "RelevantDocument", maxCount: 1 },
    { name: "UploadAuditedStatement", maxCount: 1 },
    { name: "UploadProvisionalStatement", maxCount: 1 },
    { name: "UploadDeclaration", maxCount: 1 },
    { name: "UploadRelevantDocs", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const DirectorPassportPhoto = req.files["DirectorPassportPhoto"] || [];
      const DirectorAdharCard = req.files["DirectorAdharCard"] || [];
      const UploadMOA = req.files["UploadMOA"] || [];
      const UploadAOA = req.files["UploadAOA"] || [];
      const UploadPhotos = req.files["UploadPhotos"] || [];
      const RelevantDocument = req.files["RelevantDocument"] || [];
      const UploadAuditedStatement = req.files["UploadAuditedStatement"] || [];
      const UploadProvisionalStatement =
        req.files["UploadProvisionalStatement"] || [];
      const UploadDeclaration = req.files["UploadDeclaration"] || [];
      const UploadRelevantDocs = req.files["UploadRelevantDocs"] || [];

      const { id } = req.params;

      const parsedData = {};
      Object.keys(req.body).forEach((key) => {
        try {
          parsedData[key] = JSON.parse(req.body[key]);
        } catch (e) {
          parsedData[key] = req.body[key];
        }
      });

      // Log parsed data for debugging
      console.log("Parsed Data: ", parsedData);

      const {
        CompanyName, CompanyEmail, CompanyNo, BrandName, WebsiteLink, CompanyAddress,
        CompanyPanNumber, SelectServices, SocialMedia, FacebookLink, InstagramLink,
        LinkedInLink, YoutubeLink, CompanyActivities, ProductService, CompanyUSP,
        ValueProposition, TechnologyInvolved, TechnologyDetails, ProductPhoto,
        AnyIpFiledResponse, RelevantDocumentComment, ItrStatus, DirectInDirectMarket,
        BusinessModel, Finance, FinanceCondition, DirectorDetails
      } = parsedData;

      // Prepare the updated data
      const updatedData = {
        CompanyName, CompanyEmail, CompanyNo, BrandName, WebsiteLink, CompanyAddress,
        CompanyPanNumber, SelectServices, SocialMedia, FacebookLink, InstagramLink,
        LinkedInLink, YoutubeLink, CompanyActivities, ProductService, CompanyUSP,
        ValueProposition, TechnologyInvolved, TechnologyDetails, ProductPhoto,
        AnyIpFiledResponse, RelevantDocumentComment, ItrStatus, DirectInDirectMarket,
        BusinessModel: Array.isArray(BusinessModel) ? BusinessModel : [] , 
        Finance, FinanceCondition, isFormSubmitted: true,
        DirectorDetails: DirectorDetails.map((director, index) => ({
          ...director,
          DirectorPassportPhoto: DirectorPassportPhoto[index],
          DirectorAdharCard: DirectorAdharCard[index]
        })),
        UploadMOA,
        UploadAOA,
        UploadPhotos,
        RelevantDocument,
        UploadAuditedStatement,
        UploadProvisionalStatement,
        UploadDeclaration,
        UploadRelevantDocs
      };

      // Log updated data for debugging
      console.log("Updated Data: ", updatedData);

      // Update the user in the database
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        updatedData,
        { new: true, upsert: false }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
);

module.exports = router;
