import { create } from "zustand";
import axios from "axios";  // Keep for public endpoints
import api from "../utils/api";  // ✅ Import interceptor
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const usePropertyStore = create((set, get) => ({
  // STATE VARIABLES
  properties: [],
  myProperties: [],
  currentProperty: null,
  inquiries: [],
  propertyInquiries: [],
  loading: false,
  error: null,
  message: null,

  // ============================================
  // PROPERTY POSTING FUNCTIONS (Authenticated)
  // ============================================

  createProperty: async (formData, accessToken) => {
    set({ loading: true, error: null, message: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      // ✅ Use api
      const res = await api.post('/properties/create/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      set({ loading: false, message: res.data.message });

      return { success: true, property: res.data.property };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create property post";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  deleteProperty: async (propertyId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      // ✅ Use api
      const res = await api.delete(`/properties/${propertyId}/delete/`);

      toast.success(res.data.message);
      set({ loading: false });

      const updatedProperties = get().myProperties.filter(prop => prop.id !== propertyId);
      set({ myProperties: updatedProperties });

      return { success: true, message: res.data.message };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete property";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ============================================
  // PROPERTY LISTING FUNCTIONS
  // ============================================

  // ❌ Public endpoint - use axios
  fetchProperties: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/properties/`);
      
      set({ properties: res.data, loading: false });
      return { success: true, properties: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch properties";
      
      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ✅ Authenticated endpoint - use api
  fetchMyProperties: async (accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get('/properties/my-posts/');

      set({ myProperties: res.data, loading: false });
      return { success: true, properties: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch your properties";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ❌ Public endpoint - use axios
  fetchPropertyDetail: async (propertyId) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/properties/${propertyId}/`);

      set({ currentProperty: res.data, loading: false });
      return { success: true, property: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch property details";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ❌ Public search - use axios
  searchProperties: async (filters) => {
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      
      if (filters.q) params.append('q', filters.q);
      if (filters.location) params.append('location', filters.location);
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.listing_type) params.append('listing_type', filters.listing_type);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);

      const response = await axios.get(
        `${API_URL}/search/properties/?${params.toString()}`
      );

      set({
        properties: response.data.properties,
        loading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Search properties error:', error);
      set({ loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  // ============================================
  // PROPERTY INQUIRY FUNCTIONS (Authenticated)
  // ============================================

  createInquiry: async (propertyId, inquiryData, accessToken) => {
    set({ loading: true, error: null, message: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.post(`/properties/${propertyId}/inquire/`, inquiryData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(res.data.message);
      set({ loading: false, message: res.data.message });

      return { success: true, inquiry: res.data.inquiry };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to submit inquiry";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  fetchMyInquiries: async (accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false };
    }

    try {
      const res = await api.get('/inquiries/my-inquiries/');

      set({ loading: false, inquiries: res.data.inquiries });
      return { success: true, inquiries: res.data.inquiries };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch inquiries";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  fetchPropertyInquiries: async (propertyId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get(`/properties/${propertyId}/inquiries/`);

      set({ 
        loading: false, 
        propertyInquiries: res.data.inquiries 
      });

      return { 
        success: true, 
        propertyTitle: res.data.property_title,
        inquiryCount: res.data.inquiry_count,
        inquiries: res.data.inquiries 
      };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch property inquiries";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  updateInquiryStatus: async (inquiryId, status, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.patch(`/inquiries/${inquiryId}/update-status/`, { status }, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(res.data.message);
      set({ loading: false });

      return { success: true, inquiry: res.data.inquiry };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update inquiry status";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // UTILITY FUNCTIONS
  clearCurrentProperty: () => set({ currentProperty: null }),
  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  
  resetStore: () => {
    set({
      properties: [],
      myProperties: [],
      currentProperty: null,
      inquiries: [],
      propertyInquiries: [],
      loading: false,
      error: null,
      message: null,
    });
  },
}));