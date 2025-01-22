const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
require("dotenv").config();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/auth_demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) =>
  console.log("MongoDB connection error:", err)
);

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
