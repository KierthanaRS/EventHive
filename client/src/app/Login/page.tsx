"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../public/assests/logo/logo3.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GlassLogin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hadleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // console.log("User logged in successfully:",data);
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
        router.replace("/Dashboard");
      } else {
        console.error("Login failed:", data.message);
        alert(`Login failed:${data.message}`);
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
          Login
        </h2>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-secondary rounded-lg hover:bg-secondary-100"
            onClick={hadleLogin}
          >
            LOGIN
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-4 text-center text-white text-sm">
          {/* <a href="#" className="hover:underline">
            Forgot Username/Password?
          </a> */}
          <br />
          <a href="/SignUp" className="hover:underline">
            Create your Account →
          </a>
        </div>
      </div>
    </div>
  );
};

export default GlassLogin;
