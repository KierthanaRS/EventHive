"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";

const AddEvents: React.FC = () => {
  const router = useRouter();

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "",
    address: "",
    participants: [] as string[],
    eventType: "",
    visibility: "Public",
    isPasswordProtected: false,
    password: "",
    coverImage: null as File | null,
    isRecurring: false,
    reminders: false,
  });
  const [email, setEmail] = useState("");
  const handleAddParticipant = () => {
    if (email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setEventData((prev) => ({
      ...prev,
      participants: [...prev.participants, email.trim()], // Add email as a string
    }));
    setEmail(""); // Clear input field after adding email
  };

  const handleRemoveParticipant = (index) => {
    setEventData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index), // Remove by index
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setEventData((prev) => ({ ...prev, [name]: value }));
  };


// Update your handleImageUpload function
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    if (file.type.startsWith("image/")) {
      try {
        // Form data for file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dummy_data"); 
        formData.append("cloud_name", "dsa9ia3e9"); // Replace with your Cloudinary cloud name

        // Send request to Cloudinary to upload the image
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dsa9ia3e9/image/upload",
          formData
        );

        if (response.data.secure_url) {
          // Set the uploaded image URL
          setEventData((prev) => ({
            ...prev,
            coverImage: response.data.secure_url,
          }));
          
        } else {
          alert("Error uploading image.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image.");
      }
    } else {
      alert("Please select a valid image file (PNG, JPG, JPEG).");
    }
  }
};


  const handleSubmit = async () => {
    console.log(eventData.participants)
    const eventDetails = {
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      venue: eventData.venue,
      address: eventData.address,
      participants: eventData.participants,
      eventType: eventData.eventType,
      visibility: eventData.visibility,
      password: eventData.password,
      coverImage: eventData.coverImage, // You may want to upload the image separately
      isRecurring: eventData.isRecurring,
      reminders: eventData.reminders,
    };

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("NO token found"); // Redirect to login if no token
      router.push("/Login");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/addEvents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventDetails),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        router.push("/Dashboard");
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/Dashboard")}
          className="text-secondary font-bold text-lg flex items-center "
        >
          <FaArrowLeft />
          <div className="ml-2">Back</div>
        </button>

        {/* Visibility Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-secondary">
            {eventData.visibility === "Public" ? "Public" : "Private"}
          </span>
          <div
            className={`relative w-14 h-7 bg-secondary rounded-full cursor-pointer ${
              eventData.visibility === "Private"
                ? "bg-secondary-100"
                : "bg-gray-300"
            }`}
            onClick={() =>
              setEventData((prev) => ({
                ...prev,
                visibility: prev.visibility === "Public" ? "Private" : "Public",
              }))
            }
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                eventData.visibility === "Private" ? "translate-x-7" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">
          Create New Event
        </h1>

        {/* Event Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleInputChange}
            placeholder="Enter event name"
            className="w-full mt-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Event Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Event Description
          </label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            placeholder="Describe your event..."
            rows={4}
            className="w-full mt-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-secondary-100">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={eventData.startDate}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-100">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={eventData.endDate}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {eventData.visibility === "Private" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Participants
          </label>
          <div className="flex space-x-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter participant email"
              className="flex-1 mt-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="bg-secondary text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
          {eventData.participants.length > 0 && (
            <ul className="mt-4 space-y-2">
              {eventData.participants.map((participant, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-secondary px-4 py-2 rounded-lg"
                >
                  <span>{participant}</span>
                  <button
                    onClick={() => handleRemoveParticipant(index)}
                    className="text-secondary-300 font-bold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        )}

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Venue Name
          </label>
          <input
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleInputChange}
            placeholder="Enter venue name"
            className="w-full mt-1 text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={eventData.address}
            onChange={handleInputChange}
            placeholder="Enter venue address"
            className="w-full mt-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Event Type
          </label>
          <select
            name="eventType"
            value={eventData.eventType}
            onChange={handleInputChange}
            className="w-full mt-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Select">Select an event type</option>
            <option value="Meeting">Meeting</option>
            <option value="Workshop">Workshop</option>
            <option value="Party">Party</option>
          </select>
        </div>
        {eventData.visibility === "Private" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-100">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={eventData.password}
              onChange={handleInputChange}
              placeholder="Set a password"
              className="w-full mt-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Event Cover Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-100">
            Cover Image
          </label>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleImageUpload}
            className="w-full mt-1 p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-center">
          <label className="block text-sm font-medium text-secondary-100 mr-4">
            Reminders
          </label>
          <input
            type="checkbox"
            checked={eventData.reminders}
            onChange={() =>
              handleToggleChange("reminders", !eventData.reminders)
            }
            className="h-5 w-5 text-secondary-100 focus:ring-secondary-200 border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-100 transition"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default AddEvents;
