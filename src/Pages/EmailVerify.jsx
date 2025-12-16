import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordStore } from "../stores/passwordstore";


export default function EmailVerify() {
  const [email, setEmail] = useState("");
  const { requestOTP, loading } = usePasswordStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await requestOTP(email);
    if (res.success) navigate("/verify-otp");
  };


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')", // replace with your image path
      }}
    >
     

      <div className="relative z-10 bg-white/95 rounded-2xl shadow-lg w-full max-w-md p-8 m-4">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Forgot password?
        </h2>
        <p className="text-gray-500 text-center mb-6">
          
          Don’t worry, you can reset it
        </p>

       <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              placeholder="janedoe@gmail.com"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition">
            {loading ? "Sending..." : "Reset Password"}
          </button>
        
           {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 mt-5">
                        Back to{" "}
                        <a href="/login" className="text-orange-500 font-medium hover:underline">
                            Login
                        </a>
                    </p>

     

         
        </form>
      </div>
    </div>
  );
}
