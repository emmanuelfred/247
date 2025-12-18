import { Star,  Phone, ChevronDown, ThumbsUp, ThumbsDown, Reply, MapPin, Clock, Home, CheckCircle, Share2, Bookmark, Briefcase, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReportListingModal from "../Component/ReportListingModal";
import JobCard from "../Component/JobCard";
import { useJobsStore } from "../stores/jobsstore";
import check from '../assets/SVG_margin.png';
// ⭐ ADD THESE IMPORTS
import WriteReviewModal from "../Component/WriteReviewModal";
import { useReviewStore } from "../stores/reviewStore";
import { useUserStore } from "../stores/userStore";
import ChatButton from "../Component/Chatbutton";
import { useBookmarkStore } from "../stores/bookmarkStore";


export default function JobListingDetail() {
  const { id } = useParams();
  const { currentJob, fetchJobDetail, jobs, fetchJobs, loading } = useJobsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // ⭐ ADD REVIEW STATE
  const { reviews, ratingSummary, fetchReviews, markHelpful } = useReviewStore();
  const { user, accessToken } = useUserStore();
  const [sortBy, setSortBy] = useState('newest');
  const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const { saveListing, unsaveListing, isListingSaved, savingId } = useBookmarkStore();
  
  
    // Check if listing is saved
    useEffect(() => {
      if (user && id) {
        const saved = isListingSaved('job', id);
        setIsSaved(saved);
      }
    }, [id, user, isListingSaved]);
  
 
  
    const handleSave = async (e) => {
      e.stopPropagation(); // Prevent card click
  
      if (!user || !accessToken) {
        navigate('/login');
        return;
      }
  
      const result = isSaved 
        ? await unsaveListing('job', id, accessToken)
        : await saveListing('job', id, accessToken);
  
      if (result.success) {
        setIsSaved(!isSaved);
      }
    };
  
    const isSaving = savingId === `job-${id}`;

  useEffect(() => {
    // Fetch job detail when component mounts
    if (id) {
      fetchJobDetail(id);
      // ⭐ FETCH REVIEWS
      fetchReviews('job', id, { sort: sortBy });
    }
    // Fetch all jobs for similar jobs section
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, [id, sortBy]);

  // ⭐ CHECK IF USER HAS APPLIED
  useEffect(() => {
    if (currentJob && user) {
      // Check if user has applied to this job
      // You can check this from your job applications data
      const userApplication = currentJob.applications?.some(
        app => app.applicant_id === user.id
      );
      setHasApplied(userApplication || false);
    }
  }, [currentJob, user]);

  // ⭐ REFRESH REVIEWS AFTER SUBMISSION
  const handleReviewSubmit = () => {
    fetchReviews('job', id, { sort: sortBy });
  };
  const handleContactSeller = () => {
    if (currentJob.posted_by.phone_number) {
      window.open(`tel:${currentJob.posted_by.phone_number}`, "_blank");
    }
  };
  // ⭐ FORMAT DATE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const stats = [
    { label: "5 Stars", value: 80, count: 365 },
    { label: "4 Stars", value: 15, count: 1 },
    { label: "3 Stars", value: 0, count: 0 },
    { label: "2 Stars", value: 0, count: 0 },
    { label: "1 Star", value: 0, count: 0 },
  ];

  if (loading || !currentJob) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </div>
    );
  }

  // Filter similar jobs (same category, excluding current job)
  const similarJobs = jobs.filter(
    (job) => job.category === currentJob.category && job.id !== currentJob.id
  ).slice(0, 4);

  // ⭐ USE REAL RATING SUMMARY IF AVAILABLE
  const displayStats = ratingSummary?.distribution ? [
    { label: "5 Stars", value: ratingSummary.distribution['5'] || 0, count: ratingSummary.distribution['5'] || 0 },
    { label: "4 Stars", value: ratingSummary.distribution['4'] || 0, count: ratingSummary.distribution['4'] || 0 },
    { label: "3 Stars", value: ratingSummary.distribution['3'] || 0, count: ratingSummary.distribution['3'] || 0 },
    { label: "2 Stars", value: ratingSummary.distribution['2'] || 0, count: ratingSummary.distribution['2'] || 0 },
    { label: "1 Star", value: ratingSummary.distribution['1'] || 0, count: ratingSummary.distribution['1'] || 0 },
  ] : stats;

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      {/* Header - Fixed for mobile */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full py-4 gap-4">
        {/* Left Section */}
        <div className="flex flex-col  items-start gap-3 flex-1">
          <div className="flex  sm:flex-row items-start gap-3 w-full">
          {/* Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {currentJob.posted_by?.profile_photo ? (
              <img
                src={currentJob.posted_by.profile_photo}
                alt={currentJob.posted_by.first_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div className="ml-0 sm:ml-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-900 break-words">
                {currentJob.job_title}
              </h2>
              <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 flex items-center flex-shrink-0">
                Verified
              </span>
            </div>
             <p className="text-sm text-gray-500 mb-2">{currentJob.company_name}</p>
          </div>
            </div>

          {/* Listing Info */}
          <div className="flex-1 min-w-0 md:pl-3 ">
          

           

            {/* Info badges - Stack on mobile */}
            <div className="flex flex-wrap items-center  gap-1 md:gap-4 text-gray-500 text-xs sm:text-sm">
              <span className="flex items-center  whitespace-nowrap">
                <MapPin size={14} className="flex-shrink-0" /> 
                {currentJob.city}, {currentJob.state}
              </span>
              <span className="flex items-center  whitespace-nowrap">
                <Briefcase size={14} className="flex-shrink-0" /> 
                {currentJob.job_type.replace('_', ' ')}
              </span>
              <span className="flex items-center  whitespace-nowrap">
                <DollarSign size={14} className="flex-shrink-0" /> 
                {`₦${currentJob.minimum_salary} - ${currentJob.maximum_salary} /${currentJob.salary_period.replace('per_', '')}`}
              </span>
              <span className="flex items-center whitespace-nowrap">
                <Clock size={14} className="flex-shrink-0" /> 
                Posted {currentJob.created_at}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-md" 
              onClick={() => {
                if(currentJob.application_method === 'onsite'){
                  window.location.href = `/apply/${currentJob.id}`;
                }
                else if (currentJob.application_method === 'external_link' && currentJob.application_link) {
                  window.open(currentJob.application_link, '_blank');
                } else {
                  window.location.href = `mailto:${currentJob.application_email}`;
              }}}>
                {currentJob.application_method === 'external_link'||currentJob.application_method === 'onsite' ? 'Apply Now' : 'Contact Employer'}
              </button>
              <button onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center space-x-1 border px-3 py-1 rounded-lg hover:bg-gray-100 transition ${
            isSaved 
              ? 'border-orange-500 text-orange-500' 
              : 'border-gray-300 text-gray-400 hover:text-gray-600'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Bookmark size={16}  fill={isSaved ? 'currentColor' : 'none'}/>
              </button>
              <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Post Listing Dropdown - Better mobile positioning */}
        <div className="relative self-start sm:self-auto md:pl-3 w-full md:w-auto flex justify-end">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#F2954D] text-white px-4 py-2 rounded-md hover:bg-[#e2853f] transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>+</span>
            <span>Post a Listing</span>
            <ChevronDown size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-8  right-0 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-200 z-10 w-full ">
              <Link
                to="/post-job"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Post Job
              </Link>
              <Link
                to="/post-property"
                className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Post Property
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Gallery */}
          <div className="bg-white rounded-xl p-4 shadow">
            <img
              src={currentJob.images.find(img => img.is_thumbnail)?.url || currentJob.images[0]?.url || "/Office-tour.png"}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
              alt="office"
            />

            {/* Image thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mt-4">
              {currentJob.images.slice(0, 5).map((image, i) => (
                <div
                  key={i}
                  className="bg-gray-100 border border-gray-100 rounded-lg h-16 sm:h-20 overflow-hidden cursor-pointer hover:border-orange-400 transition"
                >
                  <img 
                    src={image.url} 
                    className="w-full h-full object-cover" 
                    alt={`Gallery ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              

            <ReportListingModal 
              listingType="job" 
              listingId={currentJob.id} 
            />
            </div>
               <div className="flex flex-col gap-2 p-4 border-t border-gray-100 mt-4">
                          <p className="text-xs font-semibold text-gray-800">
                            {`₦${currentJob.minimum_salary}-${currentJob.maximum_salary}/${currentJob.salary_period.replace('per_', '')}`}
                          </p>
                          <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                            <button 
                              onClick={handleContactSeller}
                              className="flex flex-1 items-center justify-center gap-2 py-2 rounded-md bg-[#FCEEE7]"
                            >
                              <Phone size={18} /> Contact Creator
                            </button>
                            <ChatButton listingType="job" listingId={currentJob.id} ownerId={currentJob.posted_by.id} />
                          </div>
                        </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
            <h2 className="font-semibold text-lg mb-3">Job Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {currentJob.job_description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {currentJob.key_responsibilities && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
              <h2 className="font-semibold text-lg mb-3">Key Responsibilities</h2>
              <div className="text-sm text-gray-700 space-y-2">
                {currentJob.key_responsibilities.split('\n').map((item, index) => (
                  item.trim() && (
                    <div key={index} className="flex items-start gap-2">
                      <img src={check} className="mt-1 flex-shrink-0" alt="check" />
                      <span>{item.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
            <h2 className="font-semibold text-lg mb-3">Requirements</h2>
            <div className="text-sm text-gray-700 space-y-2">
              {currentJob.requirements.split('\n').map((item, index) => (
                item.trim() && (
                  <div key={index} className="flex items-start gap-2">
                    <img src={check} className="mt-1 flex-shrink-0" alt="check" />
                    <span>{item.trim()}</span>
                  </div>
                )
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <strong>Experience:</strong> {currentJob.experience_years} years
                </span>
                <span className="flex items-center gap-2">
                  <strong>Education:</strong> {currentJob.education}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {currentJob.benefits && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
              <h2 className="font-semibold text-lg mb-3">Benefits</h2>
              <div className="text-sm text-gray-700 space-y-2">
                {currentJob.benefits.split('\n').map((item, index) => (
                  item.trim() && (
                    <div key={index} className="flex items-start gap-2">
                      <img src={check} className="mt-1 flex-shrink-0" alt="check" />
                      <span>{item.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow">
            <h2 className="font-semibold text-lg mb-3">About {currentJob.company_name}</h2>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {currentJob.posted_by?.profile_photo ? (
                  <img
                    src={currentJob.posted_by.profile_photo}
                    alt={currentJob.posted_by.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {currentJob.posted_by?.first_name} {currentJob.posted_by?.last_name}
                </p>
                <p className="text-sm text-gray-500">{currentJob.posted_by?.email}</p>
                {currentJob.posted_by?.location && (
                  <p className="text-sm text-gray-500 mt-1">
                    <MapPin size={14} className="inline mr-1" />
                    {currentJob.posted_by.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Reviews */}
        <div className="bg-white shadow rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Reviews</h3>
            {/* ⭐ ADD WRITE REVIEW BUTTON */}
            {user  && (
              <WriteReviewModal
                targetType="job"
                targetId={currentJob.id}
                onSuccess={handleReviewSubmit}
              />
            )}
          </div>

          {/* ⭐ SHOW MESSAGE IF NOT APPLIED */}
          {user && !hasApplied && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
              <p className="text-gray-700">
                💡 You need to apply to this job before you can leave a review
              </p>
            </div>
          )}

          {/* ⭐ SHOW MESSAGE IF NOT LOGGED IN */}
          {!user && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-center">
              <p className="text-gray-700">
                Please login to write a review
              </p>
            </div>
          )}

          {/* ⭐ USE REAL RATING SUMMARY */}
          <p className="text-gray-600 text-sm mb-3">
            {ratingSummary?.count || 0} reviews for this Job
          </p>

          <div className="flex items-center gap-1 text-yellow-500 mb-1">
            <span className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(ratingSummary?.average || 0) 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
                  }
                  size={16}
                />
              ))}
            </span>
            <span className="text-gray-800 font-semibold ml-1">
              {ratingSummary?.average?.toFixed(1) || '0.0'}
            </span>
            <span className="text-blue-600 text-xs ml-1">
              ({ratingSummary?.count || 0})
            </span>
          </div>

          {/* ⭐ RATING DISTRIBUTION */}
          <div className="space-y-2 mb-4">
            {displayStats.map((s, i) => {
              const total = ratingSummary?.count || 1;
              const percentage = total > 0 ? (s.count / total) * 100 : 0;
              
              return (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-16 text-xs sm:text-sm">{s.label}</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-yellow-500 h-2 rounded transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-500 text-xs">({s.count})</span>
                </div>
              );
            })}
          </div>

          {/* ⭐ SORT OPTIONS */}
          <div className="flex text-sm text-gray-700 flex-col gap-2 my-4">
            <div className="flex items-center gap-1">
              <span className="font-medium mr-3">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-semibold cursor-pointer text-sm border-none focus:outline-none bg-transparent"
              >
                <option value="newest">Most recent</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
                <option value="helpful">Most helpful</option>
              </select>
            </div>
          </div>

          {/* ⭐ REAL REVIEWS LIST */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {review.reviewer.first_name?.charAt(0)}
                      {review.reviewer.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {review.reviewer.first_name} {review.reviewer.last_name}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < review.rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(review.created_at)}</span>
                    {accessToken && (
                      <>
                        <button
                          onClick={() => markHelpful(review.id, accessToken)}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          <ThumbsUp size={14} /> Helpful ({review.helpful_count})
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold my-4 text-gray-800">
            Similar Jobs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similarJobs.map((job) => (
              <JobCard 
                key={job.id}
                id={job.id}
                company={job.company_name}
                title={job.job_title}
                type={[job.job_type.replace('_', ' '), job.category]}
                salary={`₦${job.minimum_salary}-${job.maximum_salary}/${job.salary_period.replace('per_', '')}`}
                location={`${job.city}, ${job.state}`}
                posted={new Date(job.created_at).toLocaleDateString()}
                thumbnail={job.thumbnail}
                posted_by={job.posted_by}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}