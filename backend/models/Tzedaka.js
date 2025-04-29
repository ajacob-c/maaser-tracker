const { default: mongoose } = require("mongoose");

const TzedakaSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    organization: String,
    amount: { type: Number, requiered: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model("Tzedaka", TzedakaSchema);