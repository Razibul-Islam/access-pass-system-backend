const mongoose = require("mongoose");
const Event = require("../../models/Event");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.5xecffb.mongodb.net/ipfs-events`,
      {
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === "POST") {
    try {
      const { eventName, category, description, startDate, endDate, sold } =
        req.body;
      const event = new Event({
        eventName,
        category,
        description,
        startDate,
        endDate,
        sold,
      });
      await event.save();
      res.status(201).json({ message: "Event saved to backend" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
