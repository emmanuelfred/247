import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordStore } from "../stores/passwordstore";


export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { verifyOTP, loading } = usePasswordStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await verifyOTP(otp.join(""));
    if (res.success) navigate("/reset_password");
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
          Password reset
        </h2>
        <p className="text-gray-500 text-center mb-6">
          
          We sent  a code to wawutech@gmail.com
        </p>

        <div className="space-y-4" >
          {/* Email */}
         <form className="mb-7 flex justify-center items-center gap-6"onSubmit={handleSubmit}>
           {otp.map((o, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={o}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-orange-400"
              required
            />
          ))}
          </form>

   

         

          {/* Login Button */}
           <button onClick={handleSubmit} disabled={loading} className="w-full mt-6 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition">
          {loading ? "Verifying..." : "Continue"}
        </button>
           {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 mt-5">
                       Didn’t receive the mail{" "}
                        <a href="/verify" className="text-orange-500 font-medium hover:underline">
                            Click to resend
                        </a>
                    </p>
                     <p className="text-center text-sm text-gray-600 mt-5">
                        Back to{" "}
                        <a href="/login" className="text-orange-500 font-medium hover:underline">
                            Login
                        </a>
                    </p>

     

         
        </div>
      </div>
    </div>
  );
}
