const { default: mongoose } = require("mongoose");

const TzedakaSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    organization: String,
    amount: { type: Number, required: true},
    date: {type: Date, required: true}
}, { timestamps: true });

module.exports = mongoose.model("Tzedaka", TzedakaSchema);