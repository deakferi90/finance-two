const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

// Initialize the app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the auth routes
app.use("/api", authRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/finance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
