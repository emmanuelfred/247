import React, { useEffect, useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../stores/bookmarkStore";
import { useUserStore } from "../stores/userStore";

export default function JobCard({
  id,
  company = "Google",
  posted = "2 days ago",
  title = "UI/UX Designer",
  type = ["Fulltime", "Remote"],
  salary = "₦300K/mt",
  location = "Lagos, Nigeria",
  thumbnail,
  posted_by,
}) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  const { saveListing, unsaveListing, isListingSaved, savingId } = useBookmarkStore();
  const { user, accessToken } = useUserStore();

  // Check if listing is saved
  useEffect(() => {
    if (user && id) {
      const saved = isListingSaved('job', id);
      setIsSaved(saved);
    }
  }, [id, user, isListingSaved]);

  const handleApplyNow = () => {
    navigate(`/jobs/${id}`);
  };

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

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 transition p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Company Logo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : posted_by?.profile_photo ? (
              <img
                src={posted_by.profile_photo}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <img
                src="/bot-circle.png"
                alt="Company Logo"
                className="w-full h-full object-contain rounded-full"
              />
            )}
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center space-x-1 border px-3 py-1 rounded-lg hover:bg-gray-100 transition ${
            isSaved 
              ? 'border-orange-500 text-orange-500' 
              : 'border-gray-300 text-gray-400 hover:text-gray-600'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-sm font-medium">
            {isSaved ? 'Saved' : 'Save'}
          </span>
          <FiBookmark 
            size={16} 
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      
      <div className="mt-3 flex gap-3 items-center">
        <p className="text-sm text-gray-800 font-medium">{company}</p>
        <p className="text-xs text-gray-500">{posted}</p>
      </div>

      {/* Job Title */}
      <div className="flex md:flex-col justify-between">
        <div className="mt-2">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mt-2">
          {type.map((t, i) => (
            <span
              key={i}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md capitalize"
              style={{height:'fit-content'}}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3">
        <div>
          <p className="text-blue-600 font-semibold text-sm">{salary}</p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
        <button 
          onClick={handleApplyNow}
          className="bg-[#F2954D] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#e2853f] transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}