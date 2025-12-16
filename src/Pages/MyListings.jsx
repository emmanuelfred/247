import React, { useState, useEffect } from "react";
import ListingCard from "../Component/ListingCard";
import DeleteModal from "../Component/DeleteModal";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useJobsStore } from "../stores/jobsstore";
import { usePropertyStore } from "../stores/Propertystore";


export default function MyListings() {
  const { accessToken } = useUserStore();
  const { myJobs, loading: jobsLoading, fetchMyJobs, deleteJob } = useJobsStore();
  const { myProperties, loading: propertiesLoading, fetchMyProperties, deleteProperty } = usePropertyStore();

  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchMyJobs(accessToken);
      fetchMyProperties(accessToken);
    }
  }, [accessToken]);

  // Combine jobs and properties into unified format
  const getAllListings = () => {
    const jobListings = (myJobs || []).map(job => ({
      id: job.id,
      type: 'job',
      title: job.job_title,
      company: job.company_name,
      tags: [job.job_type, job.category],
      status: job.status.charAt(0).toUpperCase() + job.status.slice(1), // Capitalize status
      price: `₦${parseFloat(job.minimum_salary).toLocaleString()}-${parseFloat(job.maximum_salary).toLocaleString()}`,
      address: `${job.city}, ${job.state}`,
      thumbnail: job.thumbnail,
      rawStatus: job.status, // Keep original for filtering
    }));

    const propertyListings = (myProperties || []).map(property => ({
      id: property.id,
      type: 'property',
      title: property.property_title,
      company: property.property_type,
      tags: [property.listing_type, property.furnishing_status],
      status: property.status.charAt(0).toUpperCase() + property.status.slice(1),
      price: `₦${parseFloat(property.price).toLocaleString()}${property.price_period?.toLowerCase().includes('month') ? '/mt' : property.price_period?.toLowerCase().includes('year') ? '/yr' : ''}`,
      address: `${property.city}, ${property.state}`,
      thumbnail: property.thumbnail,
      rawStatus: property.status,
    }));

    return [...jobListings, ...propertyListings];
  };

  const listings = getAllListings();

  // Map filter values to match backend status values
  const getFilteredListings = () => {
    if (filter === "All") return listings;
    
    // Map UI filter names to backend status values
    const statusMap = {
      "Approved": "approved",
      "Pending": "pending",
      "Declined": "rejected", // Backend uses 'rejected' instead of 'declined'
    };

    const backendStatus = statusMap[filter];
    return listings.filter(l => l.rawStatus === backendStatus);
  };

  const filtered = getFilteredListings();

  const handleDelete = async () => {
    if (!selectedListing) return;

    if (selectedListing.type === 'job') {
      const result = await deleteJob(selectedListing.id, accessToken);
      if (result.success) {
        setModalOpen(false);
        setSelectedListing(null);
      }
    } else if (selectedListing.type === 'property') {
      const result = await deleteProperty(selectedListing.id, accessToken);
      if (result.success) {
        setModalOpen(false);
        setSelectedListing(null);
      }
    }
  };

  const loading = jobsLoading || propertiesLoading;

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        {/* Header */}
        <div className="flex md:justify-between md:items-center mb-6 flex-col gap-3 md:flex-row relative">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">My Listings</h2>
            <p className="text-sm text-gray-500">
              Manage your job and property postings
            </p>
          </div>

          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#F2954D] text-white px-4 py-2 rounded-md hover:bg-[#e2853f] transition flex items-center gap-2"
            >
              <span>+</span>
              <span>Post a Listing</span>
              <ChevronDown size={18} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                <Link
                  to="/jobs/create"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Post Job
                </Link>
                <Link
                  to="/properties/create"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Post Property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b-2 border-gray-200 mb-6">
          {["All", "Approved", "Pending", "Declined"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2 font-medium text-sm ${
                filter === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab} ({tab === "All" ? listings.length : listings.filter(l => {
                if (tab === "Approved") return l.rawStatus === "approved";
                if (tab === "Pending") return l.rawStatus === "pending";
                if (tab === "Declined") return l.rawStatus === "rejected";
                return false;
              }).length})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && listings.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === "All" ? "No Listings Yet" : `No ${filter} Listings`}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {filter === "All" 
                ? "You haven't posted any jobs or properties yet."
                : `You don't have any ${filter.toLowerCase()} listings.`
              }
            </p>
          </div>
        )}

        {/* Listings */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            {filtered.map((listing) => (
              <ListingCard
                key={`${listing.type}-${listing.id}`}
                {...listing}
                onDelete={() => {
                  setSelectedListing(listing);
                  setModalOpen(true);
                }}
                onResubmit={() => alert(`Re-submit feature coming soon for ${listing.title}`)}
                onEdit={() => alert(`Edit feature coming soon for ${listing.title}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedListing(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}