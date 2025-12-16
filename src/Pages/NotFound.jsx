import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Illustration */}
      <img
        src="/404-illustration.png"
        alt="404 illustration"
        className="w-100 h-auto "
      />

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 mb-6">
        Sorry, we couldn’t find the page you’re looking for.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="bg-[#F29A56] text-white font-medium px-6 py-2 rounded-md hover:bg-[#e48945] transition"
      >
        Go Back Home
      </button>
    </div>
  );
}
