/**
 * NOTIFICATION STORE - FIXED
 * File: src/stores/notificationStore.js
 * 
 * ✅ NOW USES api INTERCEPTOR FOR AUTOMATIC TOKEN REFRESH
 */

import { create } from 'zustand';
import api from '../utils/api'; // ✅ USE API INTERCEPTOR instead of axios
import toast from 'react-hot-toast';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  preferences: null,
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    has_next: false,
    has_previous: false,
  },
  loading: false,
  error: null,

  // ============================================
  // NOTIFICATION PREFERENCES
  // ============================================

  /**
   * Fetch user's notification preferences
   */
  fetchPreferences: async () => {
    try {
      set({ loading: true, error: null });

      // ✅ USING api INTERCEPTOR - No need to manually add token
      const response = await api.get('/api/notifications/preferences/');

      if (response.data.success) {
        set({
          preferences: response.data.preferences,
          loading: false,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      set({
        error: error.response?.data?.error || 'Failed to load preferences',
        loading: false,
      });
      toast.error('Failed to load notification preferences');
    }
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (updatedPrefs) => {
    try {
      set({ loading: true, error: null });

      // ✅ USING api INTERCEPTOR
      const response = await api.post(
        '/api/notifications/preferences/update/',
        updatedPrefs
      );

      if (response.data.success) {
        set({
          preferences: { ...get().preferences, ...updatedPrefs },
          loading: false,
        });
        toast.success('Notification preferences updated');
        return response.data;
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      set({
        error: error.response?.data?.error || 'Failed to update preferences',
        loading: false,
      });
      toast.error('Failed to update notification preferences');
      return { success: false };
    }
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Fetch notifications with filters
   */
  fetchNotifications: async (page = 1, filter = 'all', limit = 20) => {
    try {
      set({ loading: true, error: null });

      // ✅ USING api INTERCEPTOR
      const response = await api.get('/api/notifications/', {
        params: { page, filter, limit },
      });

      if (response.data.success) {
        set({
          notifications: response.data.notifications,
          pagination: response.data.pagination,
          loading: false,
        });
        
        // Also fetch unread count
        get().fetchUnreadCount();
        
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({
        error: error.response?.data?.error || 'Failed to load notifications',
        loading: false,
      });
      toast.error('Failed to load notifications');
    }
  },

  /**
   * Fetch unread notification count
   */
  fetchUnreadCount: async () => {
    try {
      // ✅ USING api INTERCEPTOR
      const response = await api.get('/api/notifications/unread-count/');

      if (response.data.success) {
        set({ unreadCount: response.data.unread_count });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      // ✅ USING api INTERCEPTOR
      const response = await api.post(
        `/api/notifications/${notificationId}/read/`
      );

      if (response.data.success) {
        // Update local state
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
        
        return response.data;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      // ✅ USING api INTERCEPTOR
      const response = await api.post('/api/notifications/mark-all-read/');

      if (response.data.success) {
        // Update local state
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            is_read: true,
          })),
          unreadCount: 0,
        }));
        
        toast.success('All notifications marked as read');
        return response.data;
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
      return { success: false };
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    try {
      // ✅ USING api INTERCEPTOR
      const response = await api.delete(
        `/api/notifications/${notificationId}/delete/`
      );

      if (response.data.success) {
        // Update local state
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notificationId),
        }));
        
        toast.success('Notification deleted');
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
      return { success: false };
    }
  },

  /**
   * Delete all read notifications
   */
  deleteAllRead: async () => {
    try {
      // ✅ USING api INTERCEPTOR
      const response = await api.post('/api/notifications/delete-all-read/');

      if (response.data.success) {
        // Update local state
        set((state) => ({
          notifications: state.notifications.filter((n) => !n.is_read),
        }));
        
        toast.success(`${response.data.count} notifications deleted`);
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast.error('Failed to delete notifications');
      return { success: false };
    }
  },

  // ============================================
  // UTILITIES
  // ============================================

  /**
   * Reset store
   */
  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      preferences: null,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        has_next: false,
        has_previous: false,
      },
      loading: false,
      error: null,
    });
  },
}));