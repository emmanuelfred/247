import React, { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import ProfileInfo from "../Component/ProfileInfo";
import MyListings from "../Component/MyListings";
import MyApplications from "../Component/MyApplications";
import SavedListings from "../Component/SavedListings";
import Settings from "../Component/Settings";
import { useUserStore } from "../stores/userStore";
import toast from "react-hot-toast";

const tabs = [
  { label: "Profile Info", value: "profile" },
  { label: "My Listings", value: "listings" },
  { label: "My Applications", value: "applications" },
  { label: "Saved Listings", value: "saved" },
  { label: "Settings", value: "settings" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, uploadCoverPhoto, uploadProfilePhoto, loading } = useUserStore();
  
  // Preview states
  const [coverPreview, setCoverPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  
  // File input refs
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  console.log("ProfilePage user:", user);

  // Get user initials for fallback
  const getInitials = () => {
    if (!user) return "??";
    const firstInitial = user.surname?.[0] || "";
    const lastInitial = user.first_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Handle cover photo upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const result = await uploadCoverPhoto(file);
    if (result.success) {
      setCoverPreview(null); // Clear preview after successful upload
    } else {
      setCoverPreview(null); // Clear preview on error
    }
  };

  // Handle profile photo upload
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const result = await uploadProfilePhoto(file);
    if (result.success) {
      setProfilePreview(null); // Clear preview after successful upload
    } else {
      setProfilePreview(null); // Clear preview on error
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "listings":
        return <MyListings />;
      case "applications":
        return <MyApplications />;
      case "saved":
        return <SavedListings />;
      case "settings":
        return <Settings />;
      default:
        return <ProfileInfo />;
    }
  };

  // Get cover photo URL (preview or actual)
  const coverPhotoUrl = coverPreview || user?.cover_photo || "./cover-photo.jpg";
  
  // Get profile photo URL (preview or actual)
  const profilePhotoUrl = profilePreview || user?.profile_photo;

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      {/* Cover photo */}
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={coverPhotoUrl}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        
        {/* Loading overlay for cover */}
        {loading && coverPreview && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-sm">Uploading...</div>
          </div>
        )}

        {/* Hidden file input for cover */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />

        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={loading}
          className="absolute bottom-3 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FaCamera className="text-gray-700" />
        </button>

        {/* Profile picture */}
        <div className="absolute -bottom-12 left-8 flex items-center">
          <div className="relative">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-[#2A3DD0] font-bold text-2xl">
                {getInitials()}
              </div>
            )}

            {/* Loading overlay for profile */}
            {loading && profilePreview && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-white text-xs">Uploading...</div>
              </div>
            )}

            {/* Hidden file input for profile */}
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              className="hidden"
            />

            <button
              onClick={() => profileInputRef.current?.click()}
              disabled={loading}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaCamera className="text-gray-700" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        {/* Tabs */}
        <div className="overflow-hidden w-full overflow-x-scroll md:overflow-x-auto">
          <div
            className="flex gap-8 border-b border-gray-200 mb-8"
            style={{ minWidth: "700px" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`pb-2 font-medium ${
                  activeTab === tab.value
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800 text-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {renderTab()}
      </div>
    </div>
  );
}