import { useState, useEffect } from "react";
import { FiHome, FiDroplet, FiMaximize2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../stores/bookmarkStore";
import { useUserStore } from "../stores/userStore";

export default function SavedListings() {
  const [activeTab, setActiveTab] = useState("jobs");
  const navigate = useNavigate();

  const { savedJobs, savedProperties, loading, fetchSavedListings, unsaveListing, savingId } = useBookmarkStore();
  const { user, accessToken } = useUserStore();

  // Fetch saved listings on mount
  useEffect(() => {
    if (user && accessToken) {
      fetchSavedListings(accessToken);
    }
  }, [user, accessToken]);

  const handleDelete = async (listingType, listingId) => {
    if (!accessToken) return;
    
    const result = await unsaveListing(listingType, listingId, accessToken);
    
    if (!result.success) {
      // Error already shown via toast in store
    }
  };

  const isDeleting = (listingType, listingId) => {
    return savingId === `${listingType}-${listingId}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 text-gray-700">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 text-gray-700">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Please login to view saved listings</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#F2954D] text-white px-6 py-2 rounded-lg hover:bg-[#e2853f] transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 text-gray-700">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-full w-full max-w-xl p-1 flex">
          <button
            onClick={() => setActiveTab("properties")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "properties"
                ? "bg-[#E1E5FF] shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Property Listings ({savedProperties.length})
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "jobs" ? "bg-[#E1E5FF] text-[#2A3DD0]" : "text-gray-500"
            }`}
          >
            Job Listings ({savedJobs.length})
          </button>
        </div>
      </div>

      {/* Job Listings */}
      {activeTab === "jobs" && (
        <>
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-100">
              <p className="text-gray-500 text-lg">No saved jobs yet</p>
              <p className="text-gray-400 text-sm mt-2">Start saving jobs to view them here!</p>
              <button
                onClick={() => navigate('/jobs')}
                className="mt-4 text-blue-600 hover:underline"
              >
                Browse Jobs →
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {savedJobs.map((item) => (
                <SavedJobCard
                  key={item.saved_id}
                  savedId={item.saved_id}
                  job={item.job}
                  savedAt={item.saved_at}
                  onDelete={() => handleDelete('job', item.job.id)}
                  isDeleting={isDeleting('job', item.job.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Property Listings */}
      {activeTab === "properties" && (
        <>
          {savedProperties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-100">
              <p className="text-gray-500 text-lg">No saved properties yet</p>
              <p className="text-gray-400 text-sm mt-2">Start saving properties to view them here!</p>
              <button
                onClick={() => navigate('/properties')}
                className="mt-4 text-blue-600 hover:underline"
              >
                Browse Properties →
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {savedProperties.map((item) => (
                <SavedPropertyCard
                  key={item.saved_id}
                  savedId={item.saved_id}
                  property={item.property}
                  savedAt={item.saved_at}
                  onDelete={() => handleDelete('property', item.property.id)}
                  isDeleting={isDeleting('property', item.property.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Saved Job Card Component (with delete button)
function SavedJobCard({ savedId, job, savedAt, onDelete, isDeleting }) {
  const navigate = useNavigate();

  const formatSalary = () => {
    const min = job.minimum_salary;
    const max = job.maximum_salary;
    const period = job.salary_period.replace('per_', '');
    return `₦${min}-${max}/${period}`;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 transition p-4 flex flex-col justify-between relative">
      {/* Delete Button */}
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
        title="Remove from saved"
      >
        <FiTrash2 size={16} />
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {job.thumbnail ? (
              <img src={job.thumbnail} alt="Logo" className="w-full h-full object-cover" />
            ) : job.posted_by?.profile_photo ? (
              <img src={job.posted_by.profile_photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src="/bot-circle.png" alt="Logo" className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-800 font-medium">{job.company_name}</p>
      </div>

      {/* Job Title */}
      <div className="mt-2">
        <h3 className="font-semibold text-gray-800 text-lg">{job.job_title}</h3>
      </div>

      {/* Tags */}
      <div className="flex space-x-2 mt-2">
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md capitalize">
          {job.job_type.replace('_', ' ')}
        </span>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md capitalize">
          {job.category}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3">
        <div>
          <p className="text-blue-600 font-semibold text-sm">{formatSalary()}</p>
          <p className="text-xs text-gray-500">{job.city}, {job.state}</p>
        </div>
        <button
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="bg-[#F2954D] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#e2853f] transition"
        >
          View Job
        </button>
      </div>
    </div>
  );
}

// Saved Property Card Component (with delete button)
function SavedPropertyCard({ savedId, property, savedAt, onDelete, isDeleting }) {
  const navigate = useNavigate();

  const formatPrice = () => {
    const price = parseFloat(property.price).toLocaleString();
    let period = '';
    if (property.price_period.toLowerCase().includes('month')) period = '/mt';
    if (property.price_period.toLowerCase().includes('year')) period = '/yr';
    return `₦${price}${period}`;
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-70 bg-gray-100">
        <img
          src={property.thumbnail || "/Frame.png"}
          alt={property.property_title}
          className="w-full h-full object-cover"
        />

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
          {property.listing_type}
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg border-2 border-red-300 p-2 transition"
          title="Remove from saved"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-base mb-1">
            {property.property_title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            {property.city}, {property.state}
          </p>

          {/* Features */}
          <div className="flex items-center space-x-4 text-gray-600 mb-3" style={{ fontSize: 10 }}>
            <div className="flex items-center space-x-1">
              <FiHome size={14} />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiDroplet size={14} />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMaximize2 size={14} />
              <span>{property.size_sqm}m²</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-blue-600 font-semibold text-sm">{formatPrice()}</p>
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="bg-[#F2954D] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#e2853f] transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}