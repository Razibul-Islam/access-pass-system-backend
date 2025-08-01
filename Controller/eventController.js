const { default: mongoose } = require("mongoose");
const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
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
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      message: "Events retrieved successfully",
      count: events.length,
      events: events,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { _id } = req.params;
    const event = await Event.findById(_id);

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
};

// Get Single event by Name
exports.getEventByName = async (req, res) => {
  try {
    const { eventName } = req.params;

    const event = await Event.findOne({ eventName: eventName }); // 🔥 Fixed here

    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    res.status(200).json({
      message: "Event retrieved successfully",
      event: event,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const { category, description, startDate, endDate, sold } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { category, description, startDate, endDate, sold },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment Sold
exports.updateSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, sold } = req.body;

    if (action === "increment_sold") {
      // Increment sold count by 1
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $inc: { sold: 1 } },
        { new: true }
      );
      res.json(updatedEvent);
    } else if (sold !== undefined) {
      // Direct update
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { sold: sold },
        { new: true }
      );
      res.json(updatedEvent);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
