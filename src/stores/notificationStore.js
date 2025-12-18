/**
 * NOTIFICATION ZUSTAND STORE
 * File: stores/notificationStore.js
 * 
 * Handles all notification operations for the app
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";
import toast from "react-hot-toast";

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // STATE
      // ============================================
      notifications: [],
      unreadCount: 0,
      preferences: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        per_page: 20,
        total_pages: 1,
        total_count: 0,
        has_next: false,
        has_previous: false,
      },

      // ============================================
      // FETCH NOTIFICATIONS
      // ============================================
      fetchNotifications: async (page = 1, type = 'all') => {
        set({ loading: true, error: null });

        try {
          const response = await api.get('/notifications/', {
            params: { page, per_page: 20, type }
          });

          set({
            notifications: response.data.notifications,
            unreadCount: response.data.counts.unread,
            pagination: response.data.pagination,
            loading: false,
          });

          return { success: true };
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to fetch notifications";
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // ============================================
      // GET UNREAD COUNT (For Badge)
      // ============================================
      fetchUnreadCount: async () => {
        try {
          const response = await api.get('/notifications/unread-count/');
          set({ unreadCount: response.data.unread_count });
          return response.data.unread_count;
        } catch (err) {
          console.error('Error fetching unread count:', err);
          return 0;
        }
      },

      // ============================================
      // GET NOTIFICATION TYPES
      // ============================================
      fetchNotificationTypes: async () => {
        try {
          const response = await api.get('/notifications/types/');
          return response.data;
        } catch (err) {
          console.error('Error fetching notification types:', err);
          return { types: {}, total_count: 0, total_unread: 0 };
        }
      },

      // ============================================
      // MARK AS READ
      // ============================================
      markAsRead: async (notificationId) => {
        try {
          await api.post(`/notifications/${notificationId}/read/`);

          // Update local state
          const updatedNotifications = get().notifications.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
          );

          set({
            notifications: updatedNotifications,
            unreadCount: Math.max(0, get().unreadCount - 1),
          });

          return { success: true };
        } catch (err) {
          console.error('Error marking as read:', err);
          return { success: false };
        }
      },

      // ============================================
      // MARK AS UNREAD
      // ============================================
      markAsUnread: async (notificationId) => {
        try {
          await api.post(`/notifications/${notificationId}/unread/`);

          // Update local state
          const updatedNotifications = get().notifications.map(n =>
            n.id === notificationId ? { ...n, is_read: false } : n
          );

          set({
            notifications: updatedNotifications,
            unreadCount: get().unreadCount + 1,
          });

          return { success: true };
        } catch (err) {
          console.error('Error marking as unread:', err);
          return { success: false };
        }
      },

      // ============================================
      // MARK ALL AS READ
      // ============================================
      markAllAsRead: async () => {
        try {
          await api.post('/notifications/mark-all-read/');

          // Update local state
          const updatedNotifications = get().notifications.map(n => ({
            ...n,
            is_read: true,
          }));

          set({
            notifications: updatedNotifications,
            unreadCount: 0,
          });

          toast.success('All notifications marked as read');
          return { success: true };
        } catch (err) {
          toast.error('Failed to mark all as read');
          return { success: false };
        }
      },

      // ============================================
      // DELETE NOTIFICATION
      // ============================================
      deleteNotification: async (notificationId) => {
        try {
          await api.delete(`/notifications/${notificationId}/delete/`);

          // Remove from local state
          const notification = get().notifications.find(n => n.id === notificationId);
          const updatedNotifications = get().notifications.filter(
            n => n.id !== notificationId
          );

          set({
            notifications: updatedNotifications,
            unreadCount: notification && !notification.is_read 
              ? Math.max(0, get().unreadCount - 1)
              : get().unreadCount,
          });

          toast.success('Notification deleted');
          return { success: true };
        } catch (err) {
          toast.error('Failed to delete notification');
          return { success: false };
        }
      },

      // ============================================
      // DELETE ALL READ
      // ============================================
      deleteAllRead: async () => {
        try {
          const response = await api.delete('/notifications/delete-all-read/');

          // Remove read notifications from local state
          const updatedNotifications = get().notifications.filter(n => !n.is_read);

          set({ notifications: updatedNotifications });

          toast.success(`${response.data.deleted_count} notifications deleted`);
          return { success: true };
        } catch (err) {
          toast.error('Failed to delete notifications');
          return { success: false };
        }
      },

      // ============================================
      // CLEAR ALL NOTIFICATIONS
      // ============================================
      clearAll: async () => {
        try {
          await api.delete('/notifications/clear-all/');

          set({
            notifications: [],
            unreadCount: 0,
          });

          toast.success('All notifications cleared');
          return { success: true };
        } catch (err) {
          toast.error('Failed to clear notifications');
          return { success: false };
        }
      },

      // ============================================
      // GET PREFERENCES
      // ============================================
      fetchPreferences: async () => {
        set({ loading: true, error: null });

        try {
          const response = await api.get('/notifications/preferences/');

          set({
            preferences: response.data.preferences,
            loading: false,
          });

          return { success: true, preferences: response.data.preferences };
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to fetch preferences";
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // ============================================
      // UPDATE PREFERENCES
      // ============================================
      updatePreferences: async (preferencesData) => {
        set({ loading: true, error: null });

        try {
          const response = await api.post('/notifications/preferences/update/', preferencesData);

          // Refetch preferences to get updated data
          await get().fetchPreferences();

          toast.success('Preferences updated successfully');
          set({ loading: false });

          return { success: true };
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to update preferences";
          toast.error(errorMsg);
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // ============================================
      // POLL FOR NEW NOTIFICATIONS (Optional)
      // ============================================
      startPolling: () => {
        const pollInterval = setInterval(() => {
          get().fetchUnreadCount();
        }, 30000); // Poll every 30 seconds

        // Store interval ID so it can be cleared later
        set({ pollInterval });
      },

      stopPolling: () => {
        const pollInterval = get().pollInterval;
        if (pollInterval) {
          clearInterval(pollInterval);
          set({ pollInterval: null });
        }
      },

      // ============================================
      // RESET STATE
      // ============================================
      resetNotifications: () => {
        get().stopPolling();
        set({
          notifications: [],
          unreadCount: 0,
          preferences: null,
          loading: false,
          error: null,
          pagination: {
            page: 1,
            per_page: 20,
            total_pages: 1,
            total_count: 0,
            has_next: false,
            has_previous: false,
          },
        });
      },
    }),
    {
      name: "notification-store",
      partialize: (state) => ({
        // Only persist unreadCount, not the full notifications list
        unreadCount: state.unreadCount,
      }),
    }
  )
);