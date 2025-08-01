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
      throw new Error("Database credentials not found");
    }

    const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.5xecffb.mongodb.net/ipfs-events`;

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
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    await connectDB();

    if (req.method === "POST") {
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
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
