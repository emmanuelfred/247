import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore_ = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
      message: null,

      // ------------------------------------
      // SIGNUP
      // ------------------------------------
      signup: async (data) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.post(`${API_URL}/signup/`, data);

          set({ message: res.data.message, loading: false });

          return {
            success: true,
            message: res.data.message,
            user_id: res.data.user_id,
          };
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Signup failed";

          set({ error: errorMsg, loading: false });

          return { success: false, error: errorMsg };
        }
      },

      // ------------------------------------
      // LOGIN
      // ------------------------------------
 login: async (data) => {
  set({ loading: true, error: null });

  try {
    const res = await axios.post(`${API_URL}/login/`, data);

    set({
      user: res.data.user,
      accessToken: res.data.token,   // <--- SAVE THIS CORRECTLY
      refreshToken: res.data.refresh, // <--- IF ANY
      loading: false
    });

    return { success: true };
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Login failed";
    set({ error: errorMsg, loading: false });
    return { success: false, error: errorMsg };
  }
},

    


      // ------------------------------------
      // LOGOUT
      // ------------------------------------
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
          error: null,
          message: null,
        });
      },

      // ------------------------------------
      // PROTECTED REQUEST HELPER
      // ------------------------------------
      authFetch: async (url, method = "GET", body = null) => {
        const token = get().token;

        if (!token) {
          return { success: false, error: "Not authenticated" };
        }

        try {
          const res = await axios({
            url: `${API_URL}${url}`,
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: body,
          });

          return { success: true, data: res.data };
        } catch (err) {
          return {
            success: false,
            error: err.response?.data || "Request failed",
          };
        }
      },

      // ------------------------------------
      // EMAIL VERIFICATION
      // ------------------------------------
      identityVerification: async (userId, data) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await axios.post(`${API_URL}/identity/${userId}/`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(res);
          set({ message: res.data.message, loading: false });
          return { success: true, message: res.data.message }; // <-- return success
        } catch (err) {
          const errorData = err.response?.data || {
            message: "Identity verification failed",
          };
          set({ error: errorData, loading: false });
          return { success: false, error: errorData }; // <-- return error
        }
      },

      verifyEmail: async (uid, token) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await axios.get(
            `${API_URL}/verify-email/${uid}/${token}/`
          );
          set({ message: res.data.message, loading: false });
        } catch (err) {
          set({
            error: err.response?.data || "Email verification failed",
            loading: false,
          });
        }
      },


saveChanges: async (formData) => {
  set({ loading: true, error: null, message: null });

  const token = get().accessToken;   // <--- USE CORRECT TOKEN
  console.log("Sending token:", token);

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const res = await axios.put(
      `${API_URL}/update-profile/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    set({ user: res.data.user, loading: false });

    return { success: true, message: "Profile updated successfully" };

  } catch (err) {
    const errorMsg = err.response?.data?.message || "Profile update failed";
    set({ error: errorMsg, loading: false });

    return { success: false, error: errorMsg };
  }
},
updatePassword: async (data) => {
  set({ loading: true, error: null, message: null });

  const token = get().accessToken;
  const userId = get().user?.id;

  if (!token || !userId) {
    toast.error("Not authenticated");
    return { success: false };
  }

  try {
    const res = await axios.post(
      `${API_URL}/update-password/${userId}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);
    set({ loading: false, message: res.data.message });

    return { success: true };

  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to update password";
    toast.error(errorMsg);

    set({ loading: false, error: errorMsg });
    return { success: false, error: errorMsg };
  }
},



updateEmail: async (email) => {
  set({ loading: true, error: null, message: null });

  const token = get().accessToken;
  const userId = get().user?.id;
   console.log("Sending token:", token);

  if (!token || !userId) {
    toast.error("Not authenticated");
    return { success: false };
  }

  try {
    const res = await axios.post(
      `${API_URL}/update-email/${userId}/`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);

    // Update email in global user state
    set({
      user: { ...get().user, email: email },
      loading: false,
      message: res.data.message
    });

    return { success: true };

  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to update email";
    toast.error(errorMsg);

    set({ loading: false, error: errorMsg });
    return { success: false, error: errorMsg };
  }
},

resendVerificationLink: async (email) => {
  set({ loading: true, error: null, message: null });

  try {
    const res = await axios.post(`${API_URL}/resend-verification/`, { email });
    set({ message: res.data.message, loading: false });
  } catch (err) {
    set({ error: err.response?.data, loading: false });
  }
},




    }),

    {
      name: "user-store", // This saves login to localStorage
    }
  )
);
