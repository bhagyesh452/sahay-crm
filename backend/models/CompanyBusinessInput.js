const mongoose = require("mongoose");
const { stringify } = require("uuid");


// Define Director Schema
const DirectorSchema = new mongoose.Schema({
  IsMainDirector: {
    type: Boolean,
    default: false
  },
  DirectorName: {
    type: String,
  },
  DirectorEmail: {
    type: String,
  },
  DirectorMobileNo: {
    type: String,
  },
  DirectorQualification: {
    type: String,
  },
  DirectorWorkExperience: {
    type: String,
  },
  DirectorAnnualIncome: {
    type: String,
  },
  DirectorPassportPhoto: {
    type: Array,
  },
  DirectorAdharCard: {
    type: Array,
  },
  LinkedInProfileLink: {
    type: String,
  },
  DirectorDesignation: {
    type: String,
  },
  DirectorAdharCardNumber: {
    type: Number,
  },
  DirectorGender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  }
})


// Define the schema
const userSchema = new mongoose.Schema({
  CompanyName: {
    type: String,
    required: true
  },
  CompanyEmail: {
    type: String,
    required: true
  },
  CompanyNo: {
    type: String,
    required: true
  },
  BrandName: {
    type: String,
    required: true
  },
  WebsiteLink: {
    type: String,
    required: true
  },
  CompanyAddress: {
    type: String,
  },
  CompanyPanNumber: {
    type: String,
    required: true
  },
  SelectServices: {
    type: Array,
    required: true
  },
  SelectServices: {
    type: Array,
    required: true
  },
  SelectServices: {
    type: Array,
    required: true
  },
  BrandName: {
    type: String,
  },
  WebsiteLink: {
    type: String,
  },
  UploadMOA: {
    type: Array,
  },
  UploadAOA: {
    type: Array,
  },
  FacebookLink: {
    type: String,
  },
  InstagramLink: {
    type: String,
  },
  LinkedInLink: {
    type: String,
  },
  YoutubeLink: {
    type: String,
  },
  CompanyActivities: {
    type: String,
  },
  ProductService: {
    type: String,
  },
  CompanyUSP: {
    type: String,
  },
  ValueProposition: {
    type: String,
  },
  TechnologyInvolved: {
    type: String,
  },
  UploadPhotos: {
    type: Array,
  },
  RelevantDocument: {
    type: Array,
  },
  DirectInDirectMarket: {
    type: String,
  },
  Finance: {
    type: String,
  },
  DirectInDirectMarket: {
    type: String,
  },
  SelectBusinessModel: {
    type: String,
  },
  BusinessModel: {
    type: String,
  },
  Financing: {
    type: String,
  },
  DirectorDetails: [DirectorSchema]
});



// Create the model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
