const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    events: {
      type: [
        {
          eventId: mongoose.Schema.Types.ObjectId, // Reference to Event collection
          name: String,
          status: { type: String, default: "upcoming" }, // "upcoming" or "completed"
          date: Date,
        },
      ],
      default: [],
    },
    badges: {
      type: [String], // Array of badge IDs or names
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
