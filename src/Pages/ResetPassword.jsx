import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { usePasswordStore } from "../stores/passwordstore";


export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const { resetPassword, loading } = usePasswordStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");
    const res = await resetPassword(password);
    if (res.success) navigate("/reset_success");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')" }}>
      <div className="bg-white/95 rounded-2xl shadow-lg w-full max-w-md p-8 m-4">
        <h2 className="text-2xl font-semibold text-center mb-1">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[["New Password", password, setPassword], ["Confirm Password", confirm, setConfirm]].map(([label, value, setter], i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md text-gray-400 text-sm p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-gray-500">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
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
