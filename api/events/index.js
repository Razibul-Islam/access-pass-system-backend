import mongoose from "mongoose";
import path from "path";

// Define Event schema directly in the function
const eventSchema = new mongoose.Schema({
  eventName: String,
  category: String,
  description: String,
  startDate: String,
  endDate: String,
  sold: Number,
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

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
  try {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    if (req.method === "GET") {
      console.log("Fetching events...");
      const events = await Event.find();
      console.log(`Found ${events.length} events`);

      res.status(200).json({
        message: "Events retrieved successfully",
        count: events.length,
        events: events,
      });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      details: "Check Vercel function logs for more details",
    });
  }
}
