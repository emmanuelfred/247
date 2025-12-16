import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useUserStore((s) => s.login);
  const loading = useUserStore((s) => s.loading);

  const navigate = useNavigate();
  const location = useLocation();


  // If user came from a protected page → redirect back there
  const redirectTo = location.state?.from || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login({ email, password });

    if (res.success) {
      toast.success("Login successful");
      navigate(redirectTo);
    } else {
      toast.error("Failed to login: " + res.error);
    }
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
          Welcome back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Login to your account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
        <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Janedoe@gmail.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none text-gray-400 text-sm focus:ring-1 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum of 8 characters"
                className="w-full border border-gray-300 rounded-md text-gray-400 text-sm p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mt-1">
              <a href="/verify" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Keep me logged in */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="keepLoggedIn" className="accent-orange-400" />
            <label htmlFor="keepLoggedIn" className="text-sm text-gray-600">
              Keep me logged in
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <img
                src="/apple.png"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              Apple
            </button>
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <img
                src="/google.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
            
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <a href="/signup" className="text-orange-500 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
