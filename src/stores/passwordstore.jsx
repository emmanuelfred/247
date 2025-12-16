import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL+'/auth';

export const usePasswordStore = create(
  persist(
    (set, get) => ({
      loading: false,
      error: null,
      message: null,
      email: null,
      resetToken: null,

      // 1️⃣ Request OTP
      requestOTP: async (email) => {
        if (!email) {
          toast.error("Email is required");
          return { success: false };
        }

        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/forgot-password/`, { email });
          set({ loading: false, email: res.data.email });
          toast.success("OTP sent to your email!");
          return { success: true };
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Failed to send OTP";
          set({ loading: false, error: errorMsg });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      // 2️⃣ Verify OTP → get reset_token
      verifyOTP: async (otp) => {
        const email = get().email;
        if (!email || !otp) {
          toast.error("OTP is required");
          return { success: false };
        }

        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/verify-otp/`, { email, otp });
          set({ loading: false, resetToken: res.data.reset_token });
          toast.success("OTP verified!");
          return { success: true };
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Invalid OTP";
          set({ loading: false, error: errorMsg });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      // 3️⃣ Reset password using reset_token
   resetPassword: async (password) => {
  const resetToken = get().resetToken;
  if (!resetToken) {
    toast.error("No reset session found. Request OTP first.");
    return { success: false };
  }
  console.log('h',{ reset_token: resetToken, password })

  set({ loading: true, error: null });
  try {
    await axios.post(`${API_URL}/reset-password/`, { reset_token: resetToken, password });
    
    // Clear everything from the store and localStorage
    set({ loading: false, resetToken: null, email: null });
    // Also clear persisted storage completely
    //localStorage.removeItem("password-reset-store");

    toast.success("Password reset successfully!");
    return { success: true };
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to reset password";
    set({ loading: false, error: errorMsg });
    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  }
}

    }),
    {
      name: "password-reset-store", // key in localStorage
      getStorage: () => localStorage,
    }
  )
);
