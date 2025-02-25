const { default: mongoose } = require("mongoose");

const taskSchema= new mongoose.Schema({
    task:String,
    assignedTo:String,
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "events", 
      },
})
module.exports = mongoose.model("Task", taskSchema);