import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import { useEffect, useState } from "react";
import { useJobsStore } from "../stores/jobsstore";
import { useUserStore } from "../stores/userStore";

export default function MyApplications() {
  const { loading, applications, fetchMyApplications, deleteApplication } = useJobsStore();
  const { user, accessToken } = useUserStore();

  const [open, setOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  console.log("MyApplications applications:", applications);

  useEffect(() => {
    if (accessToken) {
      fetchMyApplications(accessToken);
    }
  }, [accessToken, fetchMyApplications]);

  // Loading State
  if (loading) {
    return (
      <div className="bg-[#fff] rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Empty State - No Applications
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-[#fff] rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {/* Icon */}
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Applications Yet
          </h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            You haven't applied to any jobs yet. Start exploring job opportunities and submit your applications to get started!
          </p>

          {/* Action Button */}
          <button 
            onClick={() => window.location.href = '/jobs'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  // Applications List
  return (
    <div className="bg-[#fff] rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          My Applications ({applications.length})
        </h2>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {applications.map((item) => {
          const job = item.job;

          return (
            <div
              key={item.application_id}
              className="border border-gray-200 bg-white rounded shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                    {job.thumbnail ? (
                      <img 
                        src={job.thumbnail} 
                        alt={job.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                        {job.company?.charAt(0) || 'J'}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {job.applicant_count} applicants
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-1">
                  {job.company} 
                  <span className="ml-2 text-gray-400">
                    {item.applied_at}
                  </span>
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  {job.title}
                </h3>

                {/* Status Badge */}
                <div className="mb-3">
                  <span 
                    className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${item.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : ''}
                      ${item.status === 'shortlisted' ? 'bg-green-100 text-green-700' : ''}
                      ${item.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                      ${item.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
                    `}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-md">
                    {job.job_type}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-md">
                    {job.salary_period}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                <div
                  className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm"
                  style={{ fontSize: 10 }}
                >
                  <div>
                    <p className="font-bold text-sm text-blue-600">
                      ₦{job.maximum_salary}
                    </p>
                    <p className="text-gray-500">
                      {job.city}, {job.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="border border-gray-300 text-gray-700 p-1 py-2 rounded-lg text-sm hover:bg-gray-100"
                      style={{ fontSize: 10 }}
                      onClick={() => window.location.href = `/applications/${job.id}`}
                    >
                      View details
                    </button>

                    <button
                      className="border border-red-200 text-red-500 p-2 rounded-lg hover:bg-red-50"
                      onClick={() => {
                        setSelectedAppId(item.application_id);
                        setOpen(true);
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          console.log("Delete application ID:", selectedAppId);
          await deleteApplication(selectedAppId, accessToken);
          setOpen(false);
        }}
      />
    </div>
  );
}