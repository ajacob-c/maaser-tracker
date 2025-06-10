const { default: mongoose } = require("mongoose");

const IncomeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    source: String,
    amount: {type: Number, required: true},
    date: {type: Date, required: true}
}, { timestamps: true });

module.exports = mongoose.model("Income", IncomeSchema);