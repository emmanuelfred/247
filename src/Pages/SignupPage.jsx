import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import toast, { Toaster } from "react-hot-toast";
import { nav } from "framer-motion/client";
import {  useNavigate } from "react-router-dom";
export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    surname: "",
    email: "",
    password: "",
  });

  const { signup, loading } = useUserStore();
  // Simple encode with Base64
const encodeID = (id) => {
  const salted = `${id}-mySecretSalt`; // optional salt
  return btoa(salted); // encode to Base64
};




  // Password validation function
  const validatePassword = (password) => {
    const lengthCheck = /.{8,}/;
    const numberCheck = /[0-9]/;
    const uppercaseCheck = /[A-Z]/;
    const specialCheck = /[^A-Za-z0-9]/;

    if (!lengthCheck.test(password)) {
      return "Password must be at least 8 characters long.";
    }
    if (!numberCheck.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!uppercaseCheck.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!specialCheck.test(password)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    return toast.error(passwordError);
  }

  const res = await signup(form);
  console.log(res);

  if (!res.success) {
    const errorMsg =
      res.error?.details?.email?.[0] ||
      res.error?.message ||
      res.error ||
      "Signup failed";

    return toast.error(errorMsg);
  }

  toast.success(res.message);
  const encodedID = encodeID(res.user_id); 

  navigate(`/verify_identity/${encodedID}`); // Navigate to login with user ID
};


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')",
      }}
    >
      

      <div className="relative z-10 bg-white/95 rounded-2xl shadow-lg w-full md:max-w-lg p-8 m-4">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Create your account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Let’s get started with a new account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Surname</label>
              <input
                type="text"
                name="surname"
                placeholder="Joe"
                value={form.surname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="Smit"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="janedoe@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Must meet password rules"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 pr-10 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Rules UI */}
            <ul className="text-xs text-gray-500 mt-1">
              <li>• Minimum 8 characters</li>
              <li>• Must include a number</li>
              <li>• Must include an uppercase letter</li>
              <li>• Must include a special character</li>
            </ul>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* SOCIAL BUTTONS */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <img src="/apple.png" alt="Apple" className="w-5 h-5 mr-2" />
              Apple
            </button>
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
              Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
