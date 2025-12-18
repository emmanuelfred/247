import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import api from "../utils/api";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
      message: null,

      // =====================================================
      // PUBLIC ENDPOINTS (axios)
      // =====================================================

      signup: async (data) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.post(`${API_URL}/signup/`, data);

          toast.success(res.data.message);

          set({
            loading: false,
            message: res.data.message,
          });

          return {
            success: true,
            message: res.data.message,
            user_id: res.data.user_id,
          };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || "Signup failed";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      login: async (data) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.post(`${API_URL}/login/`, data);

          toast.success("Login successful");

          set({
            user: res.data.user,
            accessToken: res.data.token,
            refreshToken: res.data.refresh,
            loading: false,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || "Login failed";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      logout: () => {
        toast.success("Logged out successfully");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
          error: null,
          message: null,
        });
      },

      verifyEmail: async (uid, token) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.get(
            `${API_URL}/verify-email/${uid}/${token}/`
          );

          toast.success(res.data.message);

          set({
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || "Email verification failed";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      resendVerificationLink: async (email) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await axios.post(
            `${API_URL}/resend-verification/`,
            { email }
          );

          toast.success(res.data.message);

          set({
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to resend verification link";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      // =====================================================
      // AUTHENTICATED ENDPOINTS (api interceptor)
      // =====================================================

      identityVerification: async (userId, data) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await api.post(
            `/auth/identity/${userId}/`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          toast.success(res.data.message);

          set({
            loading: false,
            message: res.data.message,
          });

          return { success: true, message: res.data.message };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message ||
            "Identity verification failed";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      saveChanges: async (formData) => {
        set({ loading: true, error: null, message: null });

        try {
          const res = await api.put(
            "/update-profile/",
            formData,
            { headers: { "Content-Type": "application/json" } }
          );

          toast.success("Profile updated successfully");

          set({
            user: res.data.user,
            loading: false,
            message: "Profile updated successfully",
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message ||
            "Profile update failed";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      updatePassword: async (data) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const res = await api.post(
            `/auth/update-password/${userId}/`,
            data
          );

          toast.success(res.data.message);

          set({
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to update password";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      updateEmail: async (email) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const res = await api.post(
            `/auth/update-email/${userId}/`,
            { email }
          );

          toast.success(res.data.message);

          set({
            user: { ...get().user, email },
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.message ||
            "Failed to update email";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      uploadCoverPhoto: async (file) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const formData = new FormData();
          formData.append("cover_photo", file);

          const res = await api.post(
            `/auth/upload-cover-photo/${userId}/`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          toast.success(res.data.message);

          set({
            user: {
              ...get().user,
              cover_photo: res.data.cover_photo,
            },
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.error ||
            "Failed to upload cover photo";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },

      uploadProfilePhoto: async (file) => {
        set({ loading: true, error: null, message: null });

        const userId = get().user?.id;

        if (!userId) {
          toast.error("Not authenticated");
          return { success: false };
        }

        try {
          const formData = new FormData();
          formData.append("profile_photo", file);

          const res = await api.post(
            `/auth/upload-profile-photo/${userId}/`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          toast.success(res.data.message);

          set({
            user: {
              ...get().user,
              profile_photo: res.data.profile_photo,
            },
            loading: false,
            message: res.data.message,
          });

          return { success: true };
        } catch (err) {
          const errorMsg =
            err.response?.data?.error ||
            "Failed to upload profile photo";

          toast.error(errorMsg);

          set({
            loading: false,
            error: errorMsg,
          });

          return { success: false, error: errorMsg };
        }
      },
    }),
    { name: "user-store" }
  )
);
