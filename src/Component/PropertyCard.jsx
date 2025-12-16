import React, { useEffect, useState } from "react";
import { FiBookmark, FiHome, FiDroplet, FiMaximize2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../stores/bookmarkStore";
import { useUserStore } from "../stores/userStore";

export default function PropertyCard({
  id,
  image = "/placeholder.png",
  title = "4 Bedroom duplex",
  address = "123, Oladele Road, Lagos, Nigeria",
  beds = 4,
  baths = 3,
  area = "320m²",
  price = "₦300K/mt",
  period = "",
  propertyType = "",
  listingType = "",
  viewCount = 0,
  inquiryCount = 0,
}) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  
  const { saveListing, unsaveListing, isListingSaved, savingId } = useBookmarkStore();
  const { user, accessToken } = useUserStore();

  // Check if listing is saved
  useEffect(() => {
    if (user && id) {
      const saved = isListingSaved('property', id);
      setIsSaved(saved);
    }
  }, [id, user, isListingSaved]);

  const handleViewDetails = () => {
    if (id) {
      navigate(`/properties/${id}`);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent card click

    if (!user || !accessToken) {
      navigate('/login');
      return;
    }

    const result = isSaved 
      ? await unsaveListing('property', id, accessToken)
      : await saveListing('property', id, accessToken);

    if (result.success) {
      setIsSaved(!isSaved);
    }
  };

  // Format price period for display
  const formatPricePeriod = () => {
    if (!period) return "";
    
    if (period.toLowerCase().includes("month")) return "/mt";
    if (period.toLowerCase().includes("year")) return "/yr";
    return "";
  };

  const isSaving = savingId === `property-${id}`;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-70 bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Listing Type Badge */}
        {listingType && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
            {listingType}
          </div>
        )}

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`absolute top-3 right-3 bg-white bg-opacity-90 rounded-lg border-2 px-2 py-1 flex items-center space-x-1 text-xs hover:bg-opacity-100 transition ${
            isSaved 
              ? 'border-orange-500 text-orange-500' 
              : 'border-gray-200 text-gray-500 hover:text-gray-700'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{isSaved ? 'Saved' : 'Save'}</span>
          <FiBookmark 
            size={14} 
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-base mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">{address}</p>

          {/* Features */}
          <div className="flex items-center space-x-4 text-gray-600 mb-3"
           style={{fontSize:10}}>
            <div className="flex items-center space-x-1">
              <FiHome size={14} />
              <span>{beds} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiDroplet size={14} />
              <span>{baths} Baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMaximize2 size={14} />
              <span>{area}</span>
            </div>
          </div>

          {/* Stats - View and Inquiry Count */}
          {(viewCount > 0 || inquiryCount > 0) && (
            <div className="flex items-center space-x-3 text-gray-500 mb-2" style={{fontSize:10}}>
              {viewCount > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{viewCount} views</span>
                </div>
              )}
              {inquiryCount > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>{inquiryCount} inquiries</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-blue-600 font-semibold text-sm">
            {price}{formatPricePeriod()}
          </p>
          <button 
            onClick={handleViewDetails}
            className="bg-[#F2954D] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#e2853f] transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}