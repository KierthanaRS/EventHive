"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../public/assests/logo/logo3.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload on form submission
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("User registered successfully:", data);
        localStorage.setItem("authToken", data.token);
        alert("Registration successful!");
        router.replace("/Dashboard");
      } else {
        console.error("Registration failed:", data.message);
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary via-secondary-100 to-secondary-300">
      <div className="relative bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 w-[350px]">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <Image src={logo.src} alt="user" width={48} height={48} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-white text-2xl font-bold mb-4">
          Register
        </h2>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="User Name"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-secondary rounded-lg hover:bg-secondary-100"
            onClick={handleRegister}
          >
            Sign Up
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-4 text-center text-white text-sm">
          {/* <a href="#" className="hover:underline">
            Forgot Username/Password?
          </a> */}
          <br />
          <a href="/Login" className="hover:underline">
            Sign In →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
