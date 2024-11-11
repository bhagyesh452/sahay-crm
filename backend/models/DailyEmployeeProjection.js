const mongoose = require('mongoose');

const DailyEmployeeProjectionSchema = new mongoose.Schema({
    ename: { type: String, required: true, unique: true }, // Unique across the entire model
    projectionsByDate: [
        {
            estimatedPaymentDate: { type: Date, required: true }, // Date when payment is expected
            projections: [
                {
                    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'newcdatas', required: true },
                    companyName : {type : String},
                    bdeName : {type : String},
                    bdmName : {type : String},
                    offeredServices: {
                        type: [String],
                        default: []
                      },
                    offeredPrice: { type: Number },
                    expectedPrice: { type: Number },
                    remarks: { type: String }
                }
            ]
        }
    ]
}, { timestamps: true });

// Index for fast lookup on ename and estimatedPaymentDate within projectionsByDate
DailyEmployeeProjectionSchema.index({ ename: 1, "projectionsByDate.estimatedPaymentDate": 1 }, { unique: true });

module.exports = mongoose.model('DailyEmployeeProjection', DailyEmployeeProjectionSchema);
