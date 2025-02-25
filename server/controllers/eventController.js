const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Log = require("../models/logModel");
const { getUserIdFromToken } = require("./userController");
const nodemailer = require('nodemailer');

exports.addEvents = async (req, res) => {
  const { id: userId, username } = getUserIdFromToken(req);
  const {
    name,
    description,
    startDate,
    endDate,
    venue,
    address,
    participants,
    eventType,
    visibility,
    password,
    coverImage,
    isRecurring,
    reminders,
  } = req.body;

  try {
    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !venue ||
      !eventType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let eventData = await Event.findOne({ userId });
    if (!eventData) {
      eventData = new Event({ userId, events: [] });
    }
    eventData.events.push({
      name,
      description,
      startDate,
      endDate,
      venue,
      address,
      participants,
      eventType,
      visibility,
      password,
      coverImage,
      isRecurring,
      reminders,
    });
    await eventData.save();
    // await sendEventInvitationEmails(participants,username, name, description, startDate, endDate);
    let logData = await Log.findOne({ userId });
    if (!logData) {
      logData = new Log({ userId, logs: [] });
    }
    logData.logs.push({
      activity: `Created an event named "${name}"`,
    });
    await logData.save();

    res
      .status(201)
      .json({ message: "Event added successfully!", event: eventData });
  } catch (error) {
    if (error.message.startsWith("Unauthorized")) {
      return res.status(401).json({ message: error.message });
    }
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const sendEventInvitationEmails = async (participants,senderName, eventName, description, startDate, endDate) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD,  
    }
  });
  for (const participant of participants) {
    if (!participant) {
      console.error("Skipping participant: Missing or invalid email", participant);
      continue;
    }
    const mailOptions = {
      from: process.env.EMAIL, 
      to: participant, 
      subject: `Invitation to the event: ${eventName}`,
      text: `
        Hello,
        
        You have been invited to the event: "${eventName}" by ${senderName}.
        
        Description: ${description}
        
        Event Start Date: ${startDate}
        Event End Date: ${endDate}
        
        We hope you can join us!

        Regards, 
        Event Hive
      `
    };

    try {
     
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending email to ${participant.email}:`, error);
    }
  }
};

exports.getEvents= async (req, res) => {
  const { id: userId } = getUserIdFromToken(req);
  const { eventId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const eventsData = await Event.find({ userId }); 
    const allEvents = eventsData.flatMap(userEvent => userEvent.events);
    const event = allEvents.find(event => event._id.equals(eventId)); 
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  }
  catch (error) {
    console.error("Error getting events:", error);
    res.status(500).json({ message: "Server error", error });
  }
}



exports.joinEvent = async (req, res) => {
  const { eventId } = req.params;

  // Validate eventId
  if (!eventId) {
    return res.status(400).send({ error: "Event ID is required" });
  }

  try {
    
    const user = getUserIdFromToken(req); 
    const userEmail = user.email; 

    
    const event = await Event.findOne({ "events._id": eventId }, { "events.$": 1 });

    if (!event || !event.events || event.events.length === 0) {
      return res.status(404).send({ error: "Event not found" });
    }

    const eventData = event.events[0]; 

    if (eventData.participants.includes(userEmail)) {
      return res.status(200).send({ message: "You have already joined this event", isJoined: true });
    }

    await Event.updateOne(
      { "events._id": eventId },
      { $push: { "events.$.participants": userEmail } }
    );

    res.status(200).send({ message: "You have successfully joined the event", isJoined: true });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
