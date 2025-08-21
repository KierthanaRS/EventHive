const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Log = require("../models/logModel");

const generateAvatar = async () => {
  const { createAvatar } = await import("@dicebear/core");
  const { avataaars } = await import("@dicebear/collection");

  // Generate a random seed
  const randomSeed = Math.random().toString(36).substring(2);

  // Generate a random avatar
  const avatar = createAvatar(avataaars, {
    seed: randomSeed, // Random seed ensures random persona
    backgroundColor: ["#ffffff", "#f0f0f0"],
    options: {
      mood: ["happy"], // Ensures a happy expression
    },
    size: 128, // Avatar size
    // accessoriesChance: 50, // 50% chance to add accessories
    // facialHairChance: 50, // 50% chance to add facial hair
    topChance: 80, // 80% chance to include hair or headgear
  });

  return avatar.toString(); // Convert avatar object to SVG string
};

//signUp
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarSvg = await generateAvatar();

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Password is hashed
      avatar: avatarSvg,
    });
    await newUser.save();
    //empty event initialisation
    await Event.create({
      userId: newUser._id,
      events: [], // Initially no events
    });
    //log initialisation
    await Log.create({
      userId: newUser._id,
      logs: [
        { activity: "User Registered", timestamp: new Date() }, // Default log
      ],
    });

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ message: "User created successfully.", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exsistingUser = await User.findOne({ email });
    if (!exsistingUser)
      return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      exsistingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: exsistingUser._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "User logged in successfully.", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error });
  }
};
