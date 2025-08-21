"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaTasks } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { IoIosChatboxes } from "react-icons/io";
import axios from "axios";
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

const Events = () => {
  const router = useRouter();
  const { eventId } = useParams() || {};
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const handleJoin = async (eventId: string) => {
    const token= localStorage.getItem("authToken");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/joinEvent/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token as a Bearer token
          },
        }
      );
      alert(response.data.message);
      setIsJoined(true);
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join the event.");
    }
  };
  
  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/getEvents/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.event) {
        setEvent(data.event);
        if (data.event.visibility === "Private") {
          setPasswordPrompt(true);
        }
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async (eventId: string | string[]) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/tasks`,
        { params: { eventId } }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updatedTask: string,
    updatedAssignedTo: string
  ) => {
    if (!updatedTask.trim() || !updatedAssignedTo.trim()) {
      alert("Task and Assignee cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/tasks/${taskId}`,
        {
          task: updatedTask,
          assignedTo: updatedAssignedTo,
          eventId,
        }
      );
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task))
      );
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/tasks/${taskId}`,
          {
            data: { eventId }, // Sending eventId as part of the request body
          }
        );
        setTasks(tasks.filter((task) => task._id !== taskId));
        alert("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error deleting task.");
      }
    }
  };
  const checkIfJoined = () => {
    const token = localStorage.getItem("authToken");
    try {
      // Decode token to get user email
      if (!token) {
        console.error("No auth token found.");
        return false;
      }
      // const decoded = JSON.parse(atob(token.split(".")[1])); // Decodes the JWT
      // const userEmail = decoded.email;
      
  
      // if (!event) {
      //   console.error("Event not found.");
      //   return false;
      // }
      const isUserJoined = event.participants.includes("kierthanars@gmail.com");
  
      setIsJoined(isUserJoined); 
      return isUserJoined;
    } catch (error) {
      console.error("Error checking join status:", error);
      return false;
    }
  };
  
  useEffect(() => {
    
    if (eventId) {
      fetchData();
      fetchTasks(eventId);
      checkIfJoined()
    }
  }, [eventId]);

  const handlePasswordSubmit = () => {
    if (enteredPassword === event.password) {
      setPasswordPrompt(false);
      setIsAuthorized(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedParticipant.trim()) {
      alert("Please provide both task details and the assignee.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/tasks`,
        {
          task: newTask,
          assignedTo: selectedParticipant,
          eventId,
        }
      );

      if (response.status === 201) {
        setTasks((prevTasks) => [...prevTasks, response.data]); // Update the task list
        setNewTask(""); // Clear the task input field
        setSelectedParticipant(""); // Clear the participant input field
        alert("Task added successfully!");
      } else {
        alert("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task. Please try again.");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, newMessage]);
      setNewMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-700">Loading event details...</div>
      </div>
    );
  }

  if (passwordPrompt) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-secondary mb-4">
            Enter Event Password
          </h2>
          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="border rounded px-4 py-2 w-full mb-4 text-black"
          />
          <button
            onClick={handlePasswordSubmit}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-600">
          Event not found or an error occurred.
        </div>
      </div>
    );
  }
  const isEventPast = new Date() > new Date(event.endDate);

  return (
    <div className="bg-gradient-to-br from-secondary via-secondary-200 to-secondary-300 min-h-screen">
      <div className="max-w-screen-lg mx-auto py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push("/Dashboard")}
          className="text-secondary-300 font-bold text-lg flex items-center mb-6"
        >
          <FaArrowLeft />
          <div className="ml-2">Back</div>
        </button>

        {/* Event Cover */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
          <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
            {event.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-secondary-200">
              Description
            </h3>
            <p className="text-gray-700 mt-2">{event.description}</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-secondary-200">
              Event Info
            </h3>
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Event Type:</strong> {event.eventType}
              </p>
              <p className="text-gray-700">
                <strong>Visibility:</strong> {event.visibility}
              </p>
              <p className="text-gray-700">
                <strong>Start:</strong> {formatDate(event.startDate)}
              </p>
              <p className="text-gray-700">
                <strong>End:</strong> {formatDate(event.endDate)}
              </p>
              <p className="text-gray-700">
                <strong>Recurring:</strong> {event.isRecurring ? "Yes" : "No"}
              </p>
              <p className="text-gray-700">
                <strong>Reminders:</strong>{" "}
                {event.reminders ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-secondary-200">Venue</h3>
          <p className="text-gray-700 mt-2">
            <strong>Venue:</strong> {event.venue}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {event.address}
          </p>
        </div>

        {/* To-Do List */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-semibold text-secondary mb-4">
            <FaTasks className="inline-block mr-2" /> To-Do List
          </h3>

          {/* Add Task Section */}
          {!isEventPast && (
            <div className="mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task"
                className="border border-gray-300 rounded px-4 py-2 w-full mb-4 text-black"
              />
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full mb-4 text-black"
              >
                <option value="" disabled>
                  Assign to a participant
                </option>
                {event.participants.map((participant: string) => (
                  <option key={participant} value={participant}>
                    {participant}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddTask}
                className="bg-secondary text-white px-4 py-2 rounded"
              >
                Add Task
              </button>
            </div>
          )}

          {/* Task List */}
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between mb-4"
              >
                <div className="text-black">
                  <strong>Task:</strong> {task.task} <br />
                  <strong>Assigned To:</strong> {task.assignedTo}
                </div>
                {!isEventPast && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateTask(
                          task._id,
                          prompt("Update Task:", task.task) || task.task,
                          prompt("Reassign To:", task.assignedTo) ||
                            task.assignedTo
                        )
                      }
                      className="bg-secondary text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks available.</p>
          )}
        </div>

        {/* Participants */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-secondary-200">
            Participants
          </h3>
          <p className="text-gray-700 mt-2">
            {event.participants.length} participants
          </p>
        </div>

        {/* Join or Past Event Message */}
        {event.visibility === "Public" && !isEventPast && !isJoined && (
          <div className="mt-6 text-center">
            <button
              onClick={handleJoin}
              className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary-200"
            >
              Join Event
            </button>
          </div>
        )}
        {isEventPast && (
          <div className="mt-6 text-center text-gray-500">
            This event has already passed. Thank you for checking it out!
          </div>
        )}

        {/* Chat Box */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-primary text-white rounded-full p-4 shadow-lg"
          >
            <IoIosChatboxes size={24} className="text-black" />
          </button>
        </div>
        {chatOpen && (
          <div className="fixed bottom-16 right-8 bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-secondary mb-2">Chat</h3>
            <div className="h-48 overflow-y-auto border rounded p-2 mb-4">
              {chatMessages.map((message, index) => (
                <p key={index} className="text-gray-700">
                  {message}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="border rounded px-4 py-2 w-full mb-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-white px-4 py-2 rounded w-full"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
