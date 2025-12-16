import React, { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PropertySearchBar() {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for all search fields
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price_range') || '');

  const handleSearch = (e) => {
    e.preventDefault();

    // Build query params (only include fields that have values)
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (location && location !== '') params.append('location', location);
    if (propertyType && propertyType !== '') params.append('property_type', propertyType);
    
    // Handle price range
    if (priceRange && priceRange !== '') {
      const [min, max] = priceRange.split('-');
      if (min) params.append('min_price', min);
      if (max) params.append('max_price', max);
    }

    // Navigate to properties page with search params
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      {/* Search Field + Filter Icon on Mobile */}
      <div className="flex flex-col flex-1 relative">
        <div className="flex items-center gap-2">
          <div className="flex flex-col flex-1">
            <strong className="text-gray-500 mb-2">Property Title</strong>
            <input
              type="text"
              placeholder="Search properties..."
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
                className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col flex-1">
              <strong className="text-gray-500 mb-2">Property Type</strong>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="commercial_building">Commercial Building</option>
                <option value="office_space">Office Space</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col flex-1">
              <strong className="text-gray-500 mb-2">Price Range</strong>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
              >
                <option value="">Any Price</option>
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
      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Location</strong>
        <input
          type="text"
          placeholder="e.g., Lagos, Abuja"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none"
        />
      </div>

      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Property Type</strong>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial_building">Commercial Building</option>
          <option value="office_space">Office Space</option>
        </select>
      </div>

      <div className="hidden md:flex flex-col flex-1">
        <strong className="text-gray-500 mb-2">Price Range</strong>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="bg-gray-100 rounded-full p-4 py-3 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
        >
          <option value="">Any Price</option>
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