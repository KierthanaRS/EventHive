const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Log = require("../models/logModel");

exports.getDashboard = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized: Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    const eventData = await Event.findOne({ userId: user._id }).lean();
    const events = eventData?.events || [];
    const currentDate = new Date();
    const upcomingEvents = events.filter(
      (event) => new Date(event.endDate) > currentDate
    );
    const pastEvents = events.filter(
      (event) => new Date(event.endDate) <= currentDate
    );

    const logs = await Log.findOne({ userId: user._id }).lean();

    if (!user) return res.status(404).json({ message: "User not found" });
    const response = {
      name: user.username,
      email: user.email,
      avatar: user.avatar || "/default-avatar.png",
      totalEvents: events.length,
      upcomingEvents,
      pastEvents,
      badges: user.badges || [],
      activityLogs: logs?.logs || [],
    };

    res.status(200).json(response);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized: Token missing"); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return { id: decoded.id, username: decoded.username , email: decoded.email};
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Unauthorized: Invalid token");
    }
    throw error; 
  }
};

exports.updateUser= async (req, res) => {
  const { username, email } = req.body;
  const { id } = this.getUserIdFromToken(req);
  try {
    const user = await User.findByIdAndUpdate(id, { username, email }, { new: true });
    res.status(200).json({ message: "User updated successfully", user });
  }
  catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

