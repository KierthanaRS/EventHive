const Task = require('../models/taskModel');


exports.addTask= async (req, res) => {
    const { task, assignedTo, eventId } = req.body;
  
    if (!eventId || !task || !assignedTo) {
      return res.status(400).send({ error: "Missing required fields" });
    }
  
    try {
      const newTask = new Task({ task, assignedTo, eventId });
      await newTask.save();
      res.status(201).send(newTask);
    } catch (error) {
      res.status(500).send({ error: "Error creating task" });
    }
  };

  exports.getTask= async (req, res) => {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).send({ error: "eventId is required" });
    }
    
    try {
      const tasks = await Task.find({ eventId });
      
      res.send(tasks);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  exports.updateTask= async(req, res) => {
    const { id } = req.params;
    const { eventId, task, assignedTo } = req.body;
  
    if (!eventId || !task || !assignedTo) {
      return res.status(400).send({ error: "Missing required fields" });
    }
  
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, eventId }, 
        { task, assignedTo },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).send({ error: "Task not found or event mismatch" });
      }
  
      res.send(updatedTask);
    } catch (error) {
      res.status(500).send({ error: "Error updating task" });
    }
  };

  exports.deleteTask= async (req, res) => {
    const { id } = req.params;
    const { eventId } = req.body;
  
    if (!eventId) {
      return res.status(400).send({ error: "eventId is required" });
    }
  
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: id, eventId });
  
      if (!deletedTask) {
        return res.status(404).send({ error: "Task not found or event mismatch" });
      }
  
      res.send({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
      res.status(500).send({ error: "Error deleting task" });
    }
  };
  
  
