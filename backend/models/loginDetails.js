const mongoose = require('mongoose');

const loginDetailsSchema = new mongoose.Schema({
    ename: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String , default:"Location Access Denied" }
});

// Create model
const LoginDetails = mongoose.model('LoginDetails', loginDetailsSchema);

// Export model
module.exports = LoginDetails;