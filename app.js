const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);

// Connect to MongoDB  mongodb+srv://<db_username>:<db_password>@cluster0.5xecffb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.5xecffb.mongodb.net/ipfs-events?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = app;
