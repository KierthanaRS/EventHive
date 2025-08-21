"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DOMPurify from "dompurify";

type ActivityLog = {
  activity: string;
  timestamp: string;
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null); // State for user data
  const [loading, setLoading] = useState(true); // State for loading
  const [sanitizedSVG, setSanitizedSVG] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
 

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/Login"); // Redirect to login page
  };
  
  const clearCookies = () => {
    document.cookie = "name=EventHive; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("NO token found"); // Redirect to login if no token
        router.push("/Login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setUsername(data.name);
          setEmail(data.email);
          
        } else {
          console.error("Failed to fetch user data");
          router.push("/Login"); // Redirect to login on error
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/Login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (user?.avatar) {
      setSanitizedSVG(DOMPurify.sanitize(user.avatar));
    }
  }, [user]);

  function formatDateToDDMMYYYY(dateString: string) {
    const date = new Date(dateString); // Convert the input string to a Date object

    const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based, so +1) and add leading zero
    const year = date.getFullYear(); // Get year

    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  }

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/updateUser`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-secondary text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-secondary-200"
      >
        Logout
      </button>
      {isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-secondary">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      {/* Avatar Edit Section */}
      <div className="flex items-center space-x-4 mb-4 ml-[30%]">
        <div className="w-30 h-30 rounded-full overflow-hidden">
          
            <div
            className="w-30 h-30 rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: sanitizedSVG }}
          />
          
        </div>
        
      </div>

      {/* Username */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-semibold text-secondary">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 p-2 w-full border rounded-md text-black"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-secondary">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 p-2 w-full border rounded-md text-black"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={toggleModal}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-secondary-100 text-white rounded-lg hover:bg-secondary-200"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* Dashboard Main Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-1">
          <div className="flex flex-col items-center">
            <div
              className="w-30 h-30 rounded-full overflow-hidden"
              dangerouslySetInnerHTML={{ __html: sanitizedSVG }}
            />
            <h2 className="text-xl font-bold mt-4 text-secondary">
              {user.name}
            </h2>
            <p className="text-sm text-secondary-100">{user.email}</p>
            <button onClick={toggleModal} className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-200">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-3">
          <h2 className="text-xl font-bold text-secondary-200">Event Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <h3 className="text-2xl font-bold text-secondary">
                {user.totalEvents}
              </h3>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <h3 className="text-2xl font-bold text-secondary">
                {user.upcomingEvents.length}
              </h3>
              <p className="text-sm text-gray-600">Upcoming Events</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <h3 className="text-2xl font-bold text-secondary">
                {user.pastEvents.length}
              </h3>
              <p className="text-sm text-gray-600">Completed Events</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-bold text-secondary-200">
            Upcoming Events
          </h2>
          <ul className="mt-4 space-y-4">
            {user.upcomingEvents.map((event: any, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center bg-secondary-100 p-4 rounded-lg text-white"
              >
                <div>
                  <h3 className="text-lg font-bold">{event.name}</h3>
                  <p className="text-sm">
                    Participants: {event.participants.length} | Start Date:{" "}
                    {formatDateToDDMMYYYY(event.startDate)} | End Date:{" "}
                    {formatDateToDDMMYYYY(event.endDate)}
                  </p>
                </div>
                <button onClick={()=>{router.push(`/ViewEvents/${event._id}`)}} className="bg-secondary text-white px-3 py-1 rounded-lg hover:bg-secondary-200">
                  Manage
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Past Events */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-bold text-secondary-200">Past Events</h2>
          <ul className="mt-4 space-y-4">
            {user.pastEvents.map((event:any, index:number) => (
              <li
                key={index}
                className="text-black flex justify-between items-center bg-gray-200 p-4 rounded-lg"
              >
                <div>
                  <h3 className="text-lg font-bold">{event.name}</h3>
                  <p className="text-sm">
                    Participants: {event.participants.length} | Start Date:{" "}
                    {formatDateToDDMMYYYY(event.startDate)} | End Date:{" "}
                    {formatDateToDDMMYYYY(event.endDate)}
                  </p>
                </div>
                <button onClick={()=>{router.push(`/ViewEvents/${event._id}`)}} className="bg-secondary text-white px-3 py-1 rounded-lg hover:bg-secondary-200">
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        {user.badges.length && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-1">
            <h2 className="text-xl font-bold text-secondary-200">Badges</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {user.badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center">
                  <Image
                    src={badge.icon}
                    alt={badge.name}
                    className="w-12 h-12"
                    width={48}
                    height={48}
                  />
                  <p className="text-sm text-gray-600 mt-2">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Logs */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-4">
          <h2 className="text-xl font-bold text-secondary-200">
            Activity Logs
          </h2>
          <ul className="mt-4 space-y-2">
            {user.activityLogs.map((log: ActivityLog, index: number) => (
              <li
              key={index}
              className="text-sm text-gray-600 bg-gray-200 p-2 rounded-lg"
              >
              <strong>Activity:</strong> {log.activity} |{" "}
              <strong>Timestamp:</strong>{" "}
              {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        {/* Add Event Button */}
        <div className="col-span-4 text-center mt-6">
          <button
            onClick={() => {
              router.push("/AddEvents");
            }}
            className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-200"
          >
            + Add Event
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
