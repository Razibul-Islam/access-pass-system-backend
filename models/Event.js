const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: String,
  category: String,
  description: String,
  startDate: String,
  endDate: String,
  sold: Number,
});

module.exports = mongoose.model("Event", eventSchema);
