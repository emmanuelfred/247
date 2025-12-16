import { FiTrash2, FiEye, FiMessageSquare } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { useJobsStore } from "../stores/jobsstore";
import { usePropertyStore } from "../stores/Propertystore";

export default function MyListings() {
  const navigate = useNavigate();
  const { accessToken } = useUserStore();
  const { myJobs, loading: jobsLoading, fetchMyJobs, deleteJob } = useJobsStore();
  const { myProperties, loading: propertiesLoading, fetchMyProperties, deleteProperty } = usePropertyStore();
  
  const [deleteModal, setDeleteModal] = useState({ open: false, type: null, id: null, title: '' });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'jobs', 'properties'

  useEffect(() => {
    if (accessToken) {
      fetchMyJobs(accessToken);
      fetchMyProperties(accessToken);
    }
  }, [accessToken]);

  const handleDelete = async () => {
    if (deleteModal.type === 'job') {
      const result = await deleteJob(deleteModal.id, accessToken);
      if (result.success) {
        setDeleteModal({ open: false, type: null, id: null, title: '' });
      }
    } else if (deleteModal.type === 'property') {
      const result = await deleteProperty(deleteModal.id, accessToken);
      if (result.success) {
        setDeleteModal({ open: false, type: null, id: null, title: '' });
      }
    }
  };

  // Combine and format all listings
  const getAllListings = () => {
    const jobListings = (myJobs || []).map(job => ({
      id: job.id,
      type: 'job',
      company: job.company_name,
      time: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
      title: job.job_title,
      tags: [job.job_type, job.category],
      salary: `₦${parseFloat(job.minimum_salary).toLocaleString()}-${parseFloat(job.maximum_salary).toLocaleString()}`,
      location: `${job.city}, ${job.state}`,
      applicants: job.applicant_count || 0,
      status: job.status,
      thumbnail: job.thumbnail,
      views: 0, // Jobs don't have view count
    }));

    const propertyListings = (myProperties || []).map(property => ({
      id: property.id,
      type: 'property',
      company: property.property_type, // Property type instead of company
      time: property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A',
      title: property.property_title,
      tags: [property.listing_type, property.furnishing_status],
      salary: `₦${parseFloat(property.price).toLocaleString()}${property.price_period?.toLowerCase().includes('month') ? '/mt' : property.price_period?.toLowerCase().includes('year') ? '/yr' : ''}`,
      location: `${property.city}, ${property.state}`,
      applicants: property.inquiry_count || 0,
      status: property.status,
      thumbnail: property.thumbnail,
      views: property.view_count || 0,
    }));

    return [...jobListings, ...propertyListings].sort((a, b) => 
      new Date(b.time) - new Date(a.time)
    );
  };

  // Filter listings based on active tab
  const getFilteredListings = () => {
    const allListings = getAllListings();
    if (activeTab === 'jobs') return allListings.filter(item => item.type === 'job');
    if (activeTab === 'properties') return allListings.filter(item => item.type === 'property');
    return allListings;
  };

  const listings = getFilteredListings();
  const loading = jobsLoading || propertiesLoading;

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (loading && listings.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
          <p className="text-gray-500 text-center mb-4">
            You haven't posted any jobs or properties yet.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/jobs/create')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Post a Job
            </button>
            <button 
              onClick={() => navigate('/properties/create')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Post a Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          All ({getAllListings().length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Jobs ({(myJobs || []).length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Properties ({(myProperties || []).length})
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <div
            key={`${listing.type}-${listing.id}`}
            className="border border-gray-200 bg-white rounded shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                {/* Thumbnail or Icon */}
                {listing.thumbnail ? (
                  <img 
                    src={listing.thumbnail} 
                    alt={listing.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs font-semibold">
                      {listing.type === 'job' ? 'JOB' : 'PROP'}
                    </span>
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex flex-col items-end gap-1 text-xs">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiMessageSquare size={12} />
                    {listing.applicants}
                  </span>
                  {listing.type === 'property' && listing.views > 0 && (
                    <span className="text-gray-600 flex items-center gap-1">
                      <FiEye size={12} />
                      {listing.views}
                    </span>
                  )}
                </div>
              </div>

              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  listing.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {listing.type === 'job' ? 'Job' : 'Property'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(listing.status)}`}>
                  {listing.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-1">
                {listing.company} <span className="ml-2 text-gray-400">{listing.time}</span>
              </p>

              <h3 className="font-semibold text-lg mb-3 line-clamp-2">{listing.title}</h3>

              <div className="flex flex-wrap gap-2 mb-5">
                {listing.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm" style={{fontSize:10}}>
                <div>
                  <p className="font-medium text-sm">{listing.salary}</p>
                  <p className="text-gray-500">{listing.location}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (listing.type === 'job') {
                        navigate(`/jobs/${listing.id}`);
                      } else {
                        navigate(`/properties/${listing.id}`);
                      }
                    }}
                    className="border border-gray-300 text-gray-700 p-1 py-2 rounded-lg text-sm hover:bg-gray-100" 
                    style={{fontSize:10}}
                  >
                    View details
                  </button>
                  <button 
                    onClick={() => setDeleteModal({ 
                      open: true, 
                      type: listing.type, 
                      id: listing.id, 
                      title: listing.title 
                    })}
                    className="border border-red-200 text-red-500 p-2 rounded-lg hover:bg-red-50"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, type: null, id: null, title: '' })}
        onConfirm={handleDelete}
        title={`Delete ${deleteModal.type === 'job' ? 'Job' : 'Property'}`}
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
    </div>
  );
}