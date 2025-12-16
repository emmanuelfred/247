import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";  // Keep for public endpoints (login, signup, etc.)
import api from "../utils/api";  // ✅ Import interceptor for authenticated requests
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL + '/auth';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
      message: null,

      // ============================================
      // PUBLIC ENDPOINTS (Use axios - no auth)
      // ============================================

      // ❌ Public - use axios
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

      // ❌ Public - use axios
      login: async (data) => {
        set({ loading: true, error: null });

        try {
          const res = await axios.post(`${API_URL}/login/`, data);

          set({
            user: res.data.user,
            accessToken: res.data.token,
            refreshToken: res.data.refresh,
            loading: false
          });

          return { success: true };
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Login failed";
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

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

      // ❌ Public - use axios
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

      // ❌ Public - use axios
      resendVerificationLink: async (email) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.post(`${API_URL}/resend-verification/`, { email });
          set({ message: res.data.message, loading: false });
        } catch (err) {
          set({ error: err.response?.data, loading: false });
        }
      },

      // ============================================
      // AUTHENTICATED ENDPOINTS (Use api - with interceptor)
      // ============================================

      // ✅ Authenticated - use api
      identityVerification: async (userId, data) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await api.post(`/identity/${userId}/`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          set({ message: res.data.message, loading: false });
          return { success: true, message: res.data.message };
        } catch (err) {
          const errorData = err.response?.data || {
            message: "Identity verification failed",
          };
          set({ error: errorData, loading: false });
          return { success: false, error: errorData };
        }
      },

      // ✅ Authenticated - use api
      saveChanges: async (formData) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await api.put('/update-profile/', formData, {
            headers: { "Content-Type": "application/json" },
          });

          set({ user: res.data.user, loading: false });

          return { success: true, message: "Profile updated successfully" };

        } catch (err) {
          const errorMsg = err.response?.data?.message || "Profile update failed";
          set({ error: errorMsg, loading: false });

          return { success: false, error: errorMsg };
        }
      },

      // ✅ Authenticated - use api
      updatePassword: async (data) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const res = await api.post(`/update-password/${userId}/`, data);

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

      // ✅ Authenticated - use api
      updateEmail: async (email) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const res = await api.post(`/update-email/${userId}/`, { email });

          toast.success(res.data.message);

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

      // ✅ Authenticated - use api
      uploadCoverPhoto: async (file) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false, error: "Not authenticated" };
        }

        try {
          const formData = new FormData();
          formData.append("cover_photo", file);

          const res = await api.post(
            `/upload-cover-photo/${userId}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toast.success(res.data.message);

          set({
            user: { ...get().user, cover_photo: res.data.cover_photo },
            loading: false,
            message: res.data.message,
          });

          return { success: true, cover_photo: res.data.cover_photo };

        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to upload cover photo";
          toast.error(errorMsg);

          set({ loading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      // ✅ Authenticated - use api
      uploadProfilePhoto: async (file) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false, error: "Not authenticated" };
        }

        try {
          const formData = new FormData();
          formData.append("profile_photo", file);

          const res = await api.post(
            `/upload-profile-photo/${userId}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toast.success(res.data.message);

          set({
            user: { ...get().user, profile_photo: res.data.profile_photo },
            loading: false,
            message: res.data.message,
          });

          return { success: true, profile_photo: res.data.profile_photo };

        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to upload profile photo";
          toast.error(errorMsg);

          set({ loading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },
    }),

    {
      name: "user-store",
    }
  )
);