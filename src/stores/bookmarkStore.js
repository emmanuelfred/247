/**
 * BOOKMARK STORE
 * File: stores/bookmarkStore.js
 */

import { create } from 'zustand';
import api from '../utils/api';  // ✅ Use interceptor
import toast from 'react-hot-toast';

export const useBookmarkStore = create((set, get) => ({
  // State
  savedJobs: [],
  savedProperties: [],
  loading: false,
  savingId: null,  // Track which listing is being saved/unsaved

  // Save a listing
  saveListing: async (listingType, listingId, accessToken) => {
    if (!accessToken) {
      toast.error('Please login to save listings');
      return { success: false };
    }

    set({ savingId: `${listingType}-${listingId}` });

    try {
      const response = await api.post('/bookmarks/save/', {
        listing_type: listingType,
        listing_id: listingId,
      });

      toast.success(response.data.message);
      set({ savingId: null });

      // Refresh saved listings
      get().fetchSavedListings(accessToken);

      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to save listing';
      toast.error(errorMsg);
      set({ savingId: null });

      return { success: false, error: errorMsg };
    }
  },

  // Unsave a listing
  unsaveListing: async (listingType, listingId, accessToken) => {
    if (!accessToken) {
      toast.error('Please login');
      return { success: false };
    }

    set({ savingId: `${listingType}-${listingId}` });

    try {
      const response = await api.delete('/bookmarks/unsave/', {
        data: {
          listing_type: listingType,
          listing_id: listingId,
        }
      });

      toast.success(response.data.message);
      set({ savingId: null });

      // Remove from local state
      if (listingType === 'job') {
        const updated = get().savedJobs.filter(item => item.job.id !== listingId);
        set({ savedJobs: updated });
      } else {
        const updated = get().savedProperties.filter(item => item.property.id !== listingId);
        set({ savedProperties: updated });
      }

      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to remove listing';
      toast.error(errorMsg);
      set({ savingId: null });

      return { success: false, error: errorMsg };
    }
  },

  // Toggle save/unsave
  toggleSave: async (listingType, listingId, isSaved, accessToken) => {
    if (isSaved) {
      return get().unsaveListing(listingType, listingId, accessToken);
    } else {
      return get().saveListing(listingType, listingId, accessToken);
    }
  },

  // Fetch all saved listings
  fetchSavedListings: async (accessToken, type = 'all') => {
    if (!accessToken) {
      return { success: false };
    }

    set({ loading: true });

    try {
      const response = await api.get(`/bookmarks/?type=${type}`);

      set({
        savedJobs: response.data.saved_jobs,
        savedProperties: response.data.saved_properties,
        loading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch saved listings:', error);
      set({ loading: false });

      return { success: false };
    }
  },

  // Check if a specific listing is saved
  checkIfSaved: async (listingType, listingId, accessToken) => {
    if (!accessToken) {
      return { is_saved: false };
    }

    try {
      const response = await api.get(
        `/bookmarks/check/?type=${listingType}&id=${listingId}`
      );

      return response.data;
    } catch (error) {
      console.error('Failed to check if saved:', error);
      return { is_saved: false };
    }
  },

  // Check if listing is in local state (for instant UI feedback)
  isListingSaved: (listingType, listingId) => {
    if (listingType === 'job') {
      return get().savedJobs.some(item => item.job.id === listingId);
    } else {
      return get().savedProperties.some(item => item.property.id === listingId);
    }
  },

  // Get total count
  getTotalCount: () => {
    return get().savedJobs.length + get().savedProperties.length;
  },

  // Reset store
  resetStore: () => {
    set({
      savedJobs: [],
      savedProperties: [],
      loading: false,
      savingId: null,
    });
  },
}));