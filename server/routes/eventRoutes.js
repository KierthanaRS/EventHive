const express = require("express");    
const { addEvents,getEvents,joinEvent} = require("../controllers/eventController");
const router = express.Router();

router.post("/addEvents", addEvents);
router.get("/getEvents/:eventId", getEvents);
router.post("/joinEvent/:eventId", joinEvent);


module.exports = router; 