const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [
      {
        name: { type: String, required: true }, // Event name
        description: { type: String, required: true }, // Event description
        startDate: { type: Date, required: true }, // Start date & time
        endDate: { type: Date, required: true }, // End date & time
        venue: { type: String, required: true }, // Venue name
        address: { type: String }, // Address (optional)
        participants: [{ type: String }], // Array of participant emails/usernames
        eventType: {
          type: String,
          enum: ["Meeting", "Workshop", "Party"],
          required: true,
        }, // Event type/category
        visibility: {
          type: String,
          enum: ["Public", "Private"],
          default: "Public",
        }, // Event visibility
        password: { type: String }, // Password for private events (optional)
        coverImage: { type: String }, // URL/path of the cover image
        isRecurring: { type: Boolean, default: false }, // Recurring event flag
        reminders: { type: Boolean, default: false }, // Reminder flag
        status: {
          type: String,
          enum: ["upcoming", "completed"],
          default: "upcoming",
        }, // Event status
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
