import { create } from "zustand";
import axios from "axios";  // Keep for public endpoints
import api from "../utils/api";  // ✅ Import interceptor for authenticated requests
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const useJobsStore = create((set, get) => ({
  // STATE VARIABLES
  jobs: [],
  myJobs: [],
  currentJob: null,
  applications: [],
  jobApplications: [],
  loading: false,
  error: null,
  message: null,

  // ============================================
  // JOB POSTING FUNCTIONS (Authenticated)
  // ============================================

  createJob: async (formData, accessToken) => {
    set({ loading: true, error: null, message: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      // ✅ Use api instead of axios - token auto-added and refreshed
      const res = await api.post('/jobs/create/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      set({ loading: false, message: res.data.message });

      return { success: true, job: res.data.job };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create job post";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  deleteJob: async (jobId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      // ✅ Use api
      const res = await api.delete(`/jobs/${jobId}/delete/`);

      toast.success(res.data.message);
      set({ loading: false });

      const updatedJobs = get().myJobs.filter(job => job.id !== jobId);
      set({ myJobs: updatedJobs });

      return { success: true, message: res.data.message };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete job";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ============================================
  // JOB LISTING FUNCTIONS
  // ============================================

  // ❌ Public endpoint - use axios (no auth needed)
  fetchJobs: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/jobs/`);
      
      set({ jobs: res.data, loading: false });
      return { success: true, jobs: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch jobs";
      
      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ✅ Authenticated endpoint - use api
  fetchMyJobs: async (accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get('/jobs/my-posts/');

      set({ myJobs: res.data, loading: false });
      return { success: true, jobs: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch your jobs";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ❌ Public endpoint - use axios
  fetchJobDetail: async (jobId) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/jobs/${jobId}/`);

      set({ currentJob: res.data, loading: false });
      return { success: true, job: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch job details";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ✅ Authenticated endpoint - use api
  fetchUserJobs: async (userId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get(`/jobs/user/${userId}/`);

      set({ loading: false });
      return { success: true, data: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch user jobs";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ============================================
  // JOB APPLICATION FUNCTIONS (Authenticated)
  // ============================================

  applyJob: async (jobId, formData, accessToken) => {
    set({ loading: true, error: null, message: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.post(`/jobs/${jobId}/apply/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      set({ loading: false, message: res.data.message });

      return { success: true, application: res.data.application };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to submit application";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  fetchMyApplications: async (accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false };
    }

    try {
      const res = await api.get('/jobs/applications/my/');

      set({ loading: false, applications: res.data.applications });
      return { success: true, applications: res.data.applications };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch applications";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  fetchApplicationDetail: async (applicationId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get(`/applications/${applicationId}/`);

      set({ loading: false });
      return { success: true, application: res.data };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch application details";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  fetchJobApplications: async (jobId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.get(`/jobs/${jobId}/applications/`);

      set({ 
        loading: false, 
        jobApplications: res.data.applications 
      });

      return { 
        success: true, 
        jobTitle: res.data.job_title,
        company: res.data.company,
        applicantCount: res.data.applicant_count,
        applications: res.data.applications 
      };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch job applications";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  deleteApplication: async (applicationId, accessToken) => {
    set({ loading: true, error: null });

    if (!accessToken) {
      toast.error("Not authenticated");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const res = await api.delete(`/applications/${applicationId}/delete/`);

      toast.success(res.data.message);
      set({ loading: false });

      const updatedApplications = get().applications.filter(
        app => app.application_id !== applicationId
      );
      set({ applications: updatedApplications });

      return { success: true, message: res.data.message };

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete application";
      toast.error(errorMsg);

      set({ loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ❌ Public search - use axios
  searchJobs: async (filters) => {
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      
      if (filters.q) params.append('q', filters.q);
      if (filters.location) params.append('location', filters.location);
      if (filters.job_type) params.append('job_type', filters.job_type);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_salary) params.append('min_salary', filters.min_salary);
      if (filters.max_salary) params.append('max_salary', filters.max_salary);

      const response = await axios.get(
        `${API_URL}/search/jobs/?${params.toString()}`
      );
      console.log('Search jobs response:', response.data);

      set({
        jobs: response.data.jobs,
        loading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Search jobs error:', error);
      set({ loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  // UTILITY FUNCTIONS
  clearCurrentJob: () => set({ currentJob: null }),
  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
  
  resetStore: () => {
    set({
      jobs: [],
      myJobs: [],
      currentJob: null,
      applications: [],
      jobApplications: [],
      loading: false,
      error: null,
      message: null,
    });
  },
}));