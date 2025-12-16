import React, { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function JobSearchBar() {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for all search fields
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('job_type') || '');
  const [salaryRange, setSalaryRange] = useState(searchParams.get('salary_range') || '');

  const handleSearch = (e) => {
    e.preventDefault();

    // Build query params (only include fields that have values)
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (location && location !== '') params.append('location', location);
    if (jobType && jobType !== '') params.append('job_type', jobType);
    
    // Handle salary range
    if (salaryRange && salaryRange !== '') {
      const [min, max] = salaryRange.split('-');
      if (min) params.append('min_salary', min);
      if (max) params.append('max_salary', max);
    }

    // Navigate to jobs page with search params
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      {/* Search Field + Filter Icon on Mobile */}
      <div className="flex flex-col flex-1 relative">
        <div className="flex items-center gap-2">
          <div className="flex flex-col flex-1">
            <strong className="text-gray-500 mb-2">Job Title</strong>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer mt-0 flex-1"
            />
          </div>

          {/* More Icon for Mobile */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-gray-200 transition mt-8"
          >
            <FiSliders size={18} />
          </button>
        </div>

        {/* Mobile Dropdown Filters */}
        {showFilters && (
          <div className="flex flex-col gap-3 mt-3 md:hidden">
            {/* Location */}
            <div className="flex flex-col flex-1">
              <strong className="text-gray-500 mb-2">Location</strong>
              <input
                type="text"
                placeholder="e.g., Lagos, Abuja"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            {/* Job Type */}
            <div className="flex flex-col flex-1">
              <strong className="text-gray-500 mb-2">Job Type</strong>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Salary Range */}
            <div className="flex flex-col flex-1">
              <strong className="text-gray-500 mb-2">Salary Range</strong>
              <select
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="">Any Salary</option>
                <option value="0-500000">₦0 - ₦500K</option>
                <option value="500000-2000000">₦500K - ₦2M</option>
                <option value="2000000-5000000">₦2M - ₦5M</option>
                <option value="5000000-10000000">₦5M - ₦10M</option>
                <option value="10000000-">₦10M+</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="mt-0 md:mt-7 gap-2 flex justify-center items-center bg-[#F2954D] text-white font-medium rounded-lg md:rounded-full p-3 px-3 md:px-6 md:py-3 hover:bg-[#e2853f] transition"
            >
              <FiSearch size={18} />
              <span className="">Search</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      {/* Location */}
      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Location</strong>
        <input
          type="text"
          placeholder="e.g., Lagos, Abuja"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none"
        />
      </div>

      {/* Job Type */}
      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Job Type</strong>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      {/* Salary Range */}
      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Salary Range</strong>
        <select
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
        >
          <option value="">Any Salary</option>
          <option value="0-500000">₦0 - ₦500K</option>
          <option value="500000-2000000">₦500K - ₦2M</option>
          <option value="2000000-5000000">₦2M - ₦5M</option>
          <option value="5000000-10000000">₦5M - ₦10M</option>
          <option value="10000000-">₦10M+</option>
        </select>
      </div>

      {/* Search Button */}
      {!showFilters && (
        <button
          onClick={handleSearch}
          className="mt-8 md:mt-7 gap-2 flex justify-center items-center bg-[#F2954D] text-white font-medium rounded-lg md:rounded-full p-3 px-3 md:px-6 md:py-3 hover:bg-[#e2853f] transition"
        >
          <FiSearch size={18} />
          <span className="hidden md:inline">Search</span>
        </button>
      )}
    </>
  );
}