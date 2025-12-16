import { useState } from "react";


export default function VerificationSuccess() {


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')", // replace with your image path
      }}
    >
     

      <div className="relative z-10 bg-white/95 rounded-2xl shadow-lg w-full max-w-md p-8 m-4">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Verification Submitted
        </h2>
        <p className="text-gray-500 text-center mb-6">
          We’ll review your info shortly. You can continue exploring while we verify your account
        </p>

        <form className="space-y-4">
           <img
                src="/verication.png"
                alt="404 illustration"
                className="w-100 h-auto "
            />
         

       

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition"
          >
          Login
          </button>

   

        
        </form>
      </div>
    </div>
  );
}
