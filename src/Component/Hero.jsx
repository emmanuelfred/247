import React from "react";

import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import {  Link } from "react-router-dom";
const Hero = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <section className="text-center py-24 px-6">
      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Find Your Next Opportunity <br />
        <span className="text-[#2A3DD0] text-3xl md:text-6xl">Without Middlemen</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
        Connect directly with employers and property owners across Nigeria. No
        agents. No extra fees. Just real opportunities.
      </p>

      {/* Button */}
       {/* Post Listing Dropdown - Better mobile positioning */}
        <div className="relative self-start sm:self-auto mt-8" style={{width:'fit-content',marginLeft:'auto',marginRight:'auto'}}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#F2954D] text-white px-4 py-2 rounded-md hover:bg-[#e2853f] transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span><FiPlus size={22}/></span>
            <span>Post a Listing</span>
           
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-200 z-10">
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
    </section>
  );
};

export default Hero;
