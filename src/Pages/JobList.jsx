import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../Component/JobCard";
import JobSearchBar from "../Component/JobSearchBar";
import { useJobsStore } from "../stores/jobsstore";

export default function JobList() {
  const { jobs, fetchJobs, searchJobs, loading } = useJobsStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if there are search params
    const hasSearchParams = searchParams.toString().length > 0;

    if (hasSearchParams) {
      // Build search filters from URL params
      const filters = {};
      
      if (searchParams.get('q')) filters.q = searchParams.get('q');
      if (searchParams.get('location')) filters.location = searchParams.get('location');
      if (searchParams.get('job_type')) filters.job_type = searchParams.get('job_type');
      if (searchParams.get('min_salary')) filters.min_salary = searchParams.get('min_salary');
      if (searchParams.get('max_salary')) filters.max_salary = searchParams.get('max_salary');

      // Search with filters
      searchJobs(filters);
    } else {
      // Fetch all jobs
      fetchJobs();
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </div>
    );
  }

  // Check if we're showing search results
  const isSearching = searchParams.toString().length > 0;
  const searchQuery = searchParams.get('q');

  return (
    <div className="max-w-7xl mx-auto py-10 px-3  pt-13 md:pt-22">
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Find Your Next Job</h2>
        <p>Search through thousands of verified job listings to find your perfect match.</p>
      </div>
      
      <div className="flex items-center bg-white rounded-lg border-2 border-gray-100 p-2 space-x-2 w-full py-4 mb-6">
        <JobSearchBar/>
      </div>

      {/* Show search info if searching */}
      {isSearching && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            {searchQuery ? (
              <>Showing results for <strong>"{searchQuery}"</strong></>
            ) : (
              <>Showing filtered results</>
            )}
            {jobs.length > 0 && <> - {jobs.length} jobs found</>}
          </p>
        </div>
      )}
       
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isSearching ? `Found ${jobs.length} Jobs` : `Showing ${jobs.length} Jobs`}
      </h2>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-100">
          {isSearching ? (
            <>
              <p className="text-gray-500 text-lg">No jobs found matching your search.</p>
              <p className="text-gray-400 text-sm mt-2">Try different keywords or filters.</p>
              <button
                onClick={() => window.location.href = '/jobs'}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear search and show all jobs
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities!</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              id={job.id}
              company={job.company_name}
              title={job.job_title}
              type={[job.job_type.replace('_', ' '), job.category]}
              salary={`₦${job.minimum_salary}-${job.maximum_salary}/${job.salary_period.replace('per_', '')}`}
              location={`${job.city}, ${job.state}`}
              posted={job.created_at}
              thumbnail={job.thumbnail}
              posted_by={job.posted_by}
            />
          ))}
        </div>
      )}
    </div>
  );
}