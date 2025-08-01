import mongoose from "mongoose";

// Event Schema
const eventSchema = new mongoose.Schema({
  eventName: String,
  category: String,
  description: String,
  startDate: String,
  endDate: String,
  sold: Number,
});

// Prevent re-compilation error
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

// Database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const dbUser = process.env.DB_USER_NAME;
    const dbPassword = process.env.DB_PASSWORD;

    if (!dbUser || !dbPassword) {
      throw new Error(
        "Database credentials not found in environment variables"
      );
    }

    const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.5xecffb.mongodb.net/ipfs-events`;

    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
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

    // Connect to database
    await connectDB();

    if (req.method === "GET") {
      console.log("Fetching events from database...");
      const events = await Event.find().lean();
      console.log(`Successfully retrieved ${events.length} events`);

      res.status(200).json({
        message: "Events retrieved successfully",
        count: events.length,
        events: events,
      });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
