const mongoose = require('mongoose');

const DailyEmployeeProjectionSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'newemployeeinfos', required: true },
    date: { type: Date, required: true }, // Date when the projection data was recorded
    totalProjectionsFed: { type: Number, default: 0 }, // Count of projections fed by employee for this date
    totalEstimatedPayment: { type: Number, default: 0 }, // Total of estimated payments for all projections fed by employee on this date
    projections: [
        {
            companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'newcdatas' },
            estimatedPaymentDate: { type: Date },
            offeredPrice: { type: Number },
            expectedPrice: { type: Number },
            remarks: { type: String }
        }
    ]
}, { timestamps: true });

DailyEmployeeProjectionSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyEmployeeProjection', DailyEmployeeProjectionSchema);
