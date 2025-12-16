import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, X, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useJobsStore } from "../stores/jobsstore";
import { useUserStore } from "../stores/userStore";

/**
 * PAGE 1: Review Applications List
 * Shows all applicants for a specific job
 * Used by: Employers to view who applied to their job
 */
export function ReviewApplicationsPage() {
  const { jobId } = useParams(); // Get job ID from URL
  const { jobApplications, loading, fetchJobApplications } = useJobsStore();
  const { accessToken } = useUserStore();
  
  const [jobInfo, setJobInfo] = useState(null);

  useEffect(() => {
    const loadApplications = async () => {
      if (accessToken && jobId) {
        const result = await fetchJobApplications(jobId, accessToken);
        if (result.success) {
          setJobInfo({
            title: result.jobTitle,
            company: result.company,
            count: result.applicantCount
          });
        }
      }
    };

    loadApplications();
  }, [jobId, accessToken]);

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
  if (!jobApplications || jobApplications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/jobs">
            <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          </Link>
          <h2 className="font-semibold text-xl">Review Applications</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Applications Yet
          </h3>
          <p className="text-gray-500 text-center mb-6">
            No one has applied to this job yet. Applications will appear here when candidates apply.
          </p>
          <Link 
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/jobs">
            <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          </Link>
          <h2 className="font-semibold text-xl">Review Applications</h2>
        </div>
        {jobInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-lg text-gray-800">{jobInfo.title}</h3>
            <p className="text-sm text-gray-600">{jobInfo.company}</p>
            <p className="text-sm text-blue-600 font-medium mt-1">
              {jobInfo.count} {jobInfo.count === 1 ? 'applicant' : 'applicants'}
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Review submitted applications ({jobApplications.length})
      </p>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {jobApplications.map((application) => {
          // Get initials from full name
          const getInitials = (name) => {
            if (!name) return '??';
            const names = name.split(' ');
            if (names.length >= 2) {
              return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
          };

          // Get file name from CV URL
          const getFileName = (url) => {
            if (!url) return 'Resume.pdf';
            const parts = url.split('/');
            return parts[parts.length - 1] || 'Resume.pdf';
          };

          return (
            <div 
              key={application.application_id} 
              className="py-4 border border-gray-100 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <Link to={`/applications/${application.application_id}`}>
                <div className="flex flex-col gap-3 p-4">
                  {/* Applicant Info */}
                  <div className="flex items-center gap-3">
                    {application.applicant.profile_photo ? (
                      <img 
                        src={application.applicant.profile_photo}
                        alt={application.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold text-sm">
                        {getInitials(application.full_name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {application.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {application.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span 
                      className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${application.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : ''}
                        ${application.status === 'shortlisted' ? 'bg-green-100 text-green-700' : ''}
                        ${application.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${application.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
                      `}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  {/* Expected Salary */}
                  <div className="text-sm">
                    <span className="text-gray-500">Expected Salary:</span>
                    <p className="font-semibold text-blue-600">
                      ₦{parseFloat(application.expected_salary).toLocaleString()}
                    </p>
                  </div>

                  {/* CV/Resume */}
                  <div>
                    <p className="text-xs font-medium mb-1 text-gray-700">CV/Resume</p>
                    <div className="border border-gray-100 rounded-md p-2 flex items-center gap-2 text-xs bg-gray-50">
                      <span className="text-[10px] font-bold border border-gray-300 p-1 rounded bg-white">
                        PDF
                      </span>
                      <span className="truncate flex-1">{getFileName(application.cv_url)}</span>
                    </div>
                  </div>

                  {/* Applied Date */}
                  <p className="text-xs text-gray-400">
                    Applied: {new Date(application.applied_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PAGE 2: Review Application Detail
 * Shows detailed information about a specific application
 * Used by: Employers to review individual applications
 */
export function ReviewApplicationDetailPage() {
  const { applicationId } = useParams();
  const { loading, fetchApplicationDetail } = useJobsStore();
  const { accessToken } = useUserStore();
  
  const [application, setApplication] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  useEffect(() => {
    const loadApplication = async () => {
      if (accessToken && applicationId) {
        const result = await fetchApplicationDetail(applicationId, accessToken);
        if (result.success) {
          setApplication(result.application);
        }
      }
    };

    loadApplication();
  }, [applicationId, accessToken]);

  const handleAccept = () => {
    // TODO: Implement accept functionality
    // You'll need to create an API endpoint to update application status
    console.log('Accept application:', applicationId);
    alert('Accept functionality to be implemented');
  };

  const handleDecline = () => {
    // TODO: Implement decline functionality
    // You'll need to create an API endpoint to update application status
    console.log('Decline application:', applicationId);
    setShowDeclineModal(false);
    alert('Decline functionality to be implemented');
  };

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

  // Not Found State
  if (!application) {
    return (
      <div className="p-6 w-full max-w-4xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Application Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            The application you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link 
            to="/jobs"
            className="text-blue-600 hover:underline"
          >
            Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Get file name from URL
  const getFileName = (url) => {
    if (!url) return 'Resume.pdf';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Resume.pdf';
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      {/* Header */}
      <div className="flex md:items-center gap-2 mb-6 justify-between bg-white flex-col md:flex-row p-3 rounded shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${application.job.id}/applications`}>
            <ArrowLeft size={30} className="cursor-pointer hover:text-blue-600" />
          </Link>
          <div>
            <h2 className="font-semibold text-xl">
              {application.full_name}'s Application
            </h2>
            <p className="text-sm text-gray-500">
              {application.job.title} at {application.job.company}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowDeclineModal(true)}
            className="bg-red-300 text-red-800 px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center hover:bg-red-400 transition-colors"
          >
            <X size={16} />
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center hover:bg-green-600 transition-colors"
          >
            Accept
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Application Details */}
      <div className="p-6 border border-gray-100 rounded-lg shadow-sm bg-white">
        {/* Status Badge */}
        <div className="mb-6">
          <span 
            className={`
              inline-block px-4 py-2 rounded-full text-sm font-medium
              ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${application.status === 'reviewed' ? 'bg-blue-100 text-blue-700' : ''}
              ${application.status === 'shortlisted' ? 'bg-green-100 text-green-700' : ''}
              ${application.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
              ${application.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
            `}
          >
            Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>

        {/* Personal Information */}
        <p className="mb-6 text-sm">
          <span className="font-medium mr-4 text-gray-400">Full Name:</span>
          {application.full_name}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <p>
            <span className="font-medium text-gray-400 mr-4">Phone number:</span>
            {application.phone_number}
          </p>
          <p>
            <span className="font-medium text-gray-400 mr-4">Email:</span>
            {application.email}
          </p>
        </div>

        {/* CV/Resume */}
        <p className="font-medium text-sm mb-2">CV/Resume</p>
        <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between text-sm mb-6 bg-gray-50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[10px] font-bold border border-gray-300 p-1 rounded bg-white">
              PDF
            </span>
            <span className="truncate">{getFileName(application.cv_url)}</span>
          </div>
          <a 
            href={application.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
          >
            <Download size={16} />
            Download
          </a>
        </div>

        {/* Expected Salary */}
        <p className="text-sm mb-6">
          <span className="font-medium text-gray-400 mr-4">Expected salary:</span>
          <span className="font-semibold text-blue-600">
            ₦{parseFloat(application.expected_salary).toLocaleString()}
          </span>
        </p>

        {/* Portfolio Website */}
        {application.portfolio_website && (
          <p className="text-sm mb-6">
            <span className="font-medium text-gray-400 mr-4">Portfolio website:</span>
            <a 
              href={application.portfolio_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {application.portfolio_website}
            </a>
          </p>
        )}

        {/* Applied Date */}
        <p className="text-sm mb-6">
          <span className="font-medium text-gray-400 mr-4">Applied on:</span>
          {new Date(application.applied_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {/* Cover Letter */}
        <p className="text-sm font-medium mb-2">Cover Letter</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {application.cover_letter}
          </p>
        </div>

        {/* Applicant Information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium mb-3">Applicant Information</p>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            {application.applicant.profile_photo ? (
              <img 
                src={application.applicant.profile_photo}
                alt={application.applicant.first_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                {application.applicant.first_name?.charAt(0)}
                {application.applicant.last_name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {application.applicant.first_name} {application.applicant.last_name}
              </p>
              <p className="text-sm text-gray-600">{application.applicant.email}</p>
              {application.applicant.location && (
                <p className="text-sm text-gray-500">{application.applicant.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Decline Application?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to decline {application.full_name}'s application? 
              This action will notify the applicant.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewApplicationsPage;
