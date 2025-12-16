/**
 * FIXED Review Store with API Interceptor
 * File: stores/reviewStore.js
 */

import { create } from 'zustand';
import axios from 'axios';  // Keep for public endpoints
import api from '../utils/api';  // ✅ Import interceptor
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export const useReviewStore = create((set, get) => ({
  reviews: [],
  myReviews: [],
  ratingSummary: null,
  loading: false,
  submitting: false,

  // ✅ Authenticated - use api
  createReview: async (targetType, targetId, reviewData, accessToken) => {
    set({ submitting: true });

    try {
      const response = await api.post('/reviews/create/', {
        target_type: targetType,
        target_id: targetId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
      });

      toast.success('Review submitted! Pending approval.');
      set({ submitting: false });

      return { success: true, data: response.data };
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Failed to submit review';
      toast.error(errorMsg);
      set({ submitting: false });

      return { success: false, error: errorMsg };
    }
  },

  // ❌ Public - use axios
  fetchReviews: async (targetType, targetId, filters = {}) => {
    set({ loading: true });

    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await axios.get(
        `${API_URL}/reviews/${targetType}/${targetId}/?${params}`
      );

      set({
        reviews: response.data.reviews,
        ratingSummary: response.data.rating_summary,
        loading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      set({ loading: false });

      return { success: false, error: 'Failed to load reviews' };
    }
  },

  // ✅ Authenticated - use api
  fetchMyReviews: async (accessToken) => {
    set({ loading: true });

    try {
      const response = await api.get('/reviews/my-reviews/');

      set({
        myReviews: response.data.reviews,
        loading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch my reviews:', error);
      set({ loading: false });

      return { success: false };
    }
  },

  // ✅ Authenticated - use api
  markHelpful: async (reviewId, accessToken) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful/`, {});

      const reviews = get().reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpful_count: response.data.helpful
              ? review.helpful_count + 1
              : review.helpful_count - 1,
          };
        }
        return review;
      });

      set({ reviews });

      toast.success(response.data.message);

      return { success: true, helpful: response.data.helpful };
    } catch (error) {
      toast.error('Failed to mark as helpful');

      return { success: false };
    }
  },

  // ✅ Authenticated - use api
  reportReview: async (reviewId, reason, description, accessToken) => {
    try {
      await api.post(`/reviews/${reviewId}/report/`, {
        reason,
        description,
      });

      toast.success('Review reported. Thank you!');

      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to report review';
      toast.error(errorMsg);

      return { success: false, error: errorMsg };
    }
  },

  clearReviews: () => {
    set({ reviews: [], ratingSummary: null });
  },
}));

