
/**
 * FIXED Report Store with API Interceptor
 * File: stores/reportStore.js
 */

import { create } from 'zustand';
import api from '../utils/api';  // ✅ Import interceptor
import toast from 'react-hot-toast';

export const useReportStore = create((set) => ({
  submitting: false,

  // ✅ Authenticated - use api
  submitReport: async (listingType, listingId, reportData, accessToken) => {
    set({ submitting: true });

    try {
      const response = await api.post('/reports/create/', {
        listing_type: listingType,
        listing_id: listingId,
        report_type: reportData.reportType,
        description: reportData.description,
        proof_url: reportData.proofUrl || null,
      });

      toast.success('Report submitted successfully! Our team will review it.');
      set({ submitting: false });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit report';
      toast.error(errorMsg);
      set({ submitting: false });

      return { success: false, error: errorMsg };
    }
  },
}));