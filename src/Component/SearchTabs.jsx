import React, { useState } from "react";
import { FaBuilding, FaBriefcase } from "react-icons/fa";
import PropertySearchBar from "./PropertySearchBar";
import JobSearchBar from "./JobSearchBar";

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState("property");

  return (
    <div className="bg-white rounded border border-gray-100 p-2 mb-6">
      {/* Navigation Tabs */}
      <nav className="flex items-center space-x-6 pb-2">
        {/* Property Tab */}
        <button
          onClick={() => setActiveTab("property")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
            activeTab === "property"
              ? "bg-[#E1E5FF] text-[#2A3DD0]"
              : "text-gray-500 hover:text-[#2A3DD0]"
          }`}
        >
          <FaBuilding size={16} />
          Properties
        </button>

        {/* Job Tab */}
        <button
          onClick={() => setActiveTab("job")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
            activeTab === "job"
              ? "bg-[#E1E5FF] text-[#2A3DD0]"
              : "text-gray-500 hover:text-[#2A3DD0]"
          }`}
        >
          <FaBriefcase size={16} />
          Jobs
        </button>
      </nav>

      {/* Search Section */}
      <div className="pt-2 w-full border-t border-gray-100">
        {activeTab === "property" && (
          <div className="flex items-center space-x-2 w-full">
            <PropertySearchBar />
          </div>
        )}

        {activeTab === "job" && (
          <div className="flex items-center space-x-2 w-full">
            <JobSearchBar />
          </div>
        )}
      </div>
    </div>
  );
}
