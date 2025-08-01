const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ipfs-events", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app;
