import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import toast, { Toaster } from "react-hot-toast";

export default function EmailVerificationSuccess() {
  const { uid, token } = useParams(); // read from URL
  const navigate = useNavigate();
  const { verifyEmail, loading } = useUserStore();
  const [status, setStatus] = useState("pending"); // "pending", "success", "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true; // avoid state updates if component unmounted

    const verify = async () => {
      try {
        const res = await verifyEmail(uid, token);

        if (!isMounted) return;

        if (res?.success) {
          setStatus("success");
          setMessage(res?.message || "Email verified successfully!");
          toast.success(res?.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(res?.error || "Email verification failed");
          toast.error(res?.error || "Email verification failed");
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setMessage("Email verification failed");
        toast.error("Email verification failed");
      }
    };

    verify();

    return () => {
      isMounted = false; // cleanup
    };
  }, [uid, token, verifyEmail]);

  const handleLogin = () => {
    navigate("/login"); // navigate to login page
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')",
      }}
    >
      <Toaster position="top-center" />
      <div className="relative z-10 bg-white/95 rounded-2xl shadow-lg w-full max-w-md p-8 m-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {status === "success"
            ? "Verification Successful"
            : status === "error"
            ? "Verification Failed"
            : "Verifying..."}
        </h2>
        <p className="text-gray-500 mb-6">{message}</p>

        <img
          src={
            status === "success"
              ? "/verification.png"
              : status === "error"
              ? "/error.png"
              : "/pending.png"
          }
          alt="Illustration"
          className="w-32 h-32 mx-auto mb-4"
        />

        {status !== "pending" && (
          <button
            onClick={handleLogin}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
