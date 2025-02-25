"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const EventHiveLanding: React.FC = () => {
  const router = useRouter();
  // Check for authToken in localStorage
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      router.replace("/Dashboard");
    }
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary via-secondary-100 to-secondary-300">
      {/* Glass Morphism Box */}
      <div className="relative flex flex-col md:flex-row items-stretch justify-between bg-white/10 backdrop-blur-md shadow-lg rounded-lg w-[90%] max-w-[900px] h-auto md:h-[400px]">
        {/* Left Side (About EventHive) */}
        <div className="flex-1 p-6 md:p-8 text-white border-b md:border-b-0 md:border-r border-white/20">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to EventHive
          </h1>
          <p className="text-s md:text-lg font-delius">
            EventHive is your ultimate collaborative event organizer. Create,
            manage, and enjoy your events with seamless participant management,
            real-time chats, and more!
          </p>
          <ul className="mt-4 space-y-2 text-s md:text-base font-delius">
            <li>✨ Create and customize events effortlessly</li>
            <li>🤝 Collaborate with your team in real time</li>
            <li>📅 Calendar integration for easy planning</li>
            <li>💬 Built-in chatroom for quick communication</li>
          </ul>
        </div>

        {/* Right Side (Sign Up / Sign In) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            Join EventHive
          </h2>
          <button
            onClick={() => router.push("/Login")}
            className="w-full md:w-3/4 p-3 mb-4 text-black bg-primary rounded-lg hover:bg-secondary-200 text-sm md:text-base"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/SignUp")}
            className="w-full md:w-3/4 p-3 text-black bg-primary rounded-lg hover:bg-secondary-200 text-sm md:text-base"
          >
            Sign Up
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default EventHiveLanding;
