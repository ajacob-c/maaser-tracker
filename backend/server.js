require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const incomeRoutes = require("./routes/income");
const tzedakaRoutes = require("./routes/tzedaka");
const summaryRoutes = require("./routes/summary");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/income", incomeRoutes);
app.use("/tzedaka", tzedakaRoutes);
app.use("/summary", summaryRoutes);

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging step

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.error("MongoDB Connection Error:", err));

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
});

