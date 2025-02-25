const express = require("express");
const { addTask, getTask, updateTask, deleteTask } = require("../controllers/taskController");
const router = express.Router();

router.get("/tasks", getTask);
router.post("/tasks", addTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports=router;
