/**
 * STEP 5: REACT COMPONENT
 * File: Component/ReportListingModal.jsx
 */

import { useState } from "react";
import { X, UploadCloud, Flag } from "lucide-react";
import { useReportStore } from "../stores/reportStore";
import { useUserStore } from "../stores/userStore";
import toast from "react-hot-toast";

export default function ReportListingModal({ listingType, listingId }) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("spam");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const { submitReport, submitting } = useReportStore();
  const { user, accessToken } = useUserStore();

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user || !accessToken) {
      toast.error("Please login to report a listing");
      setOpen(false);
      return;
    }

    // Validation
    if (!description.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    // Submit report (without file for now - you can add S3 upload later)
    const result = await submitReport(
      listingType,
      listingId,
      {
        reportType,
        description: description.trim(),
        proofUrl: null, // Add S3 upload here if needed
      },
      accessToken
    );

    if (result.success) {
      // Reset form
      setReportType("spam");
      setDescription("");
      setFile(null);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <ReportListingModal 
  listingType="job" 
  listingId={currentJob.id} 
/>

<ReportListingModal 
  listingType="property" 
  listingId={property.id} 
/>*/}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-red-500 mt-3 hover:text-red-600 transition-colors"
      >
        <Flag size={16} /> Report listing
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-2">Report Listing</h2>
            <p className="text-sm text-gray-500 mb-4">
              Tell us what's wrong with this listing. Our team will review it shortly.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Report Type */}
              <label className="text-sm font-medium block mb-2">Report Type *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="spam">Spam</option>
                <option value="fraud">Fraud/Scam</option>
                <option value="incorrect_info">Incorrect Information</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="duplicate">Duplicate Listing</option>
                <option value="expired">Expired/Unavailable</option>
                <option value="other">Other</option>
              </select>

              {/* Description */}
              <label className="text-sm font-medium block mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
                placeholder="Describe the issue in detail..."
                required
                maxLength={500}
              />
              <div className="text-xs text-gray-500 -mt-3 mb-4 text-right">
                {description.length}/500 characters
              </div>

              {/* Upload (Optional) */}
              <label className="text-sm font-medium block mb-2">
                Upload proof (optional)
              </label>
              
              {!file ? (
                <label className="border border-dashed border-gray-300 rounded-lg w-full h-32 flex flex-col items-center justify-center gap-2 cursor-pointer mb-4 hover:border-red-400 hover:bg-red-50 transition-colors">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Drop your files here</span>
                  <span className="text-xs text-blue-600">Browse files from your computer</span>
                  <span className="text-xs text-gray-400">Max 5MB</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                  />
                </label>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Buttons */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {submitting ? "Submitting..." : "Report Listing"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}