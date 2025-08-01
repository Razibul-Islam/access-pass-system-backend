const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.5xecffb.mongodb.net/ipfs-events`,
  {
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
  }
);

module.exports = app;
