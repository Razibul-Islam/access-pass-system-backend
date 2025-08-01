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
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await connectDB();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json({
        message: "Event retrieved successfully",
        event: event,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      // Check if this is for updating sold count
      const { action, sold, category, description, startDate, endDate } =
        req.body;

      if (action === "increment_sold") {
        // Increment sold count by 1
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { $inc: { sold: 1 } },
          { new: true }
        );
        return res.json(updatedEvent);
      } else if (sold !== undefined && !category && !description) {
        // Direct sold update
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { sold: sold },
          { new: true }
        );
        return res.json(updatedEvent);
      } else {
        // Regular event update
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { category, description, startDate, endDate, sold },
          { new: true }
        );

        if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
          message: "Event updated successfully",
          updatedEvent,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
