const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  getEventByName,
  updateSold,
} = require("../Controller/eventController");

router.post("/create", createEvent);

router.get("/", getAllEvents);
router.get("/:_id", getEventById);
router.get("/name/:eventName", getEventByName);
router.put("/update/:id", updateEvent);
router.put("/sold/:id", updateSold);

module.exports = router;
