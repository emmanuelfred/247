import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  MessageCircle,
  Phone,
  Star,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MapPin,
  Clock,
  Home,
  CheckCircle,
  Share2,
  Bookmark,
  ShieldCheck
} from "lucide-react";
import ReportListingModal from "../Component/ReportListingModal";
import PropertyCard from "../Component/PropertyCard";
import { useUserStore } from "../stores/userStore";
import { usePropertyStore } from "../stores/Propertystore";
import ChatButton from "../Component/Chatbutton";
// ⭐ ADD REVIEW IMPORTS
import WriteReviewModal from "../Component/WriteReviewModal";
import { useReviewStore } from "../stores/reviewStore";
import { useBookmarkStore } from "../stores/bookmarkStore";
const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProperty, properties, loading, fetchPropertyDetail, fetchProperties, clearCurrentProperty } = usePropertyStore();
  const { user, accessToken } = useUserStore();
   const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // ⭐ ADD REVIEW STATE
  const { reviews, ratingSummary, fetchReviews, markHelpful } = useReviewStore();
  const [sortBy, setSortBy] = useState('newest');
  const [hasInquired, setHasInquired] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { saveListing, unsaveListing, isListingSaved, savingId } = useBookmarkStore();
 

  // Check if listing is saved
  useEffect(() => {
    if (user && id) {
      const saved = isListingSaved('property', id);
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
      ? await unsaveListing('property', id, accessToken)
      : await saveListing('property', id, accessToken);

    if (result.success) {
      setIsSaved(!isSaved);
    }
  };
  const isSaving = savingId === `property-${id}`;
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        console.log("Fetching property with ID:", id);
        const result = await fetchPropertyDetail(id);
        console.log("Property fetch result:", result);
        
        // ⭐ FETCH REVIEWS
        fetchReviews('property', id, { sort: sortBy });
        
        // ⭐ CHECK IF USER HAS INQUIRED
        if (result.success && result.property && user) {
          const userInquiry = result.property.inquiries?.some(
            inquiry => inquiry.inquirer_id === user.id || inquiry.user_id === user.id
          );
          setHasInquired(userInquiry || false);
        }
      }
      // Fetch other properties for "Latest Home Listings" section
      if (!properties || properties.length === 0) {
        await fetchProperties();
      }
    };

    loadData();

    return () => clearCurrentProperty();
  }, [id, user, sortBy]);
  
  // ⭐ REFRESH REVIEWS AFTER SUBMISSION
  const handleReviewSubmit = () => {
    fetchReviews('property', id, { sort: sortBy });
  };

  // ⭐ UPDATE hasInquired AFTER SUCCESSFUL INQUIRY
  const handleInquirySuccess = () => {
    setHasInquired(true);
    setShowInquiryModal(false);
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
  
  // Debug log
  console.log("Current property state:", currentProperty);
  console.log("Loading state:", loading);

  // ⭐ USE REAL RATING SUMMARY IF AVAILABLE
  const displayStats = ratingSummary?.distribution ? [
    { label: "5 Stars", value: ratingSummary.distribution['5'] || 0, count: ratingSummary.distribution['5'] || 0 },
    { label: "4 Stars", value: ratingSummary.distribution['4'] || 0, count: ratingSummary.distribution['4'] || 0 },
    { label: "3 Stars", value: ratingSummary.distribution['3'] || 0, count: ratingSummary.distribution['3'] || 0 },
    { label: "2 Stars", value: ratingSummary.distribution['2'] || 0, count: ratingSummary.distribution['2'] || 0 },
    { label: "1 Star", value: ratingSummary.distribution['1'] || 0, count: ratingSummary.distribution['1'] || 0 },
  ] : [
    { label: "5 Stars", value: 80, count: 365 },
    { label: "4 Stars", value: 15, count: 1 },
    { label: "3 Stars", value: 0, count: 0 },
    { label: "2 Stars", value: 0, count: 0 },
    { label: "1 Star", value: 0, count: 0 },
  ];

  // Loading state
  if (loading && !currentProperty) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!loading && !currentProperty) {
    console.log("Property not found - currentProperty:", currentProperty);
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Property Not Found</h3>
          <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/properties")} className="text-blue-600 hover:underline">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const property = currentProperty;
  
  // Additional safety check
  if (!property || !property.posted_by) {
    console.log("Property data incomplete:", property);
    return (
      <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  const images = property.images || [];
  const mainImage = images.length > 0 ? images[selectedImage]?.url : "/Frame.png";
  const thumbnails = images.slice(0, 4);

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const handleInquiry = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowInquiryModal(true);
    }
  };
  const handleContactSeller = () => {
    if (property.posted_by.phone_number) {
      window.open(`tel:${property.posted_by.phone_number}`, "_blank");
    }
  };

  // Get latest properties excluding current one
  const latestProperties = properties.filter(p => p.id !== property.id).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full py-4 gap-4">
        <div className="flex flex-col  items-start gap-3 flex-1">
          {/* Left Section */}
          <div className="flex flex-col  items-start gap-3">
            <div className="flex gap-3">
              {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              {property.posted_by?.profile_photo ? (
                <img src={property.posted_by.profile_photo} alt={property.posted_by.first_name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {property.posted_by?.first_name?.charAt(0) || '?'}{property.posted_by?.last_name?.charAt(0) || ''}
                </div>
              )}
            </div>
              <div>
                <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg text-gray-900">{property.property_title || 'Untitled Property'}</h2>
                <span className="text-xs bg-blue-600 text-white rounded-full p-0.5 flex items-center justify-center">
                <ShieldCheck size={20}  />
                </span>
                

              </div>
              <p className="text-sm text-gray-500">
                {property.posted_by?.first_name || ''} {property.posted_by?.last_name || ''}
              </p>

              </div>
            

            </div>
          

            {/* Listing Info */}
            <div className="md:ml-7">
        

              
              <div className="flex flex-wrap items-center  gap-1 md:gap-4 items-center  mt-1 text-gray-500 text-sm">
                <span className="flex items-center ">
                  <MapPin size={14} /> {property.city || 'N/A'}, {property.state || 'N/A'}
                </span>
                <span className="flex items-center">
                  <Home size={14} /> {property.price_period || 'N/A'}
                </span>
                <span className="flex items-center ">
                  <CheckCircle size={14} /> {property.furnishing_status || 'N/A'}
                </span>
                <span className="flex items-center ">
                  <Clock size={14} /> {property.created_at ? getTimeAgo(property.created_at) : 'Recently'}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button 
                  onClick={handleInquiry}
                  className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-md"
                >
                  Make an Inquiry
                </button>
                <button  onClick={handleSave}
          disabled={isSaving}
            className={`flex items-center space-x-1 border px-3 py-1 rounded-lg hover:bg-gray-100 transition ${
            isSaved 
              ? 'border-orange-500 text-orange-500' 
              : 'border-gray-300 text-gray-400 hover:text-gray-600'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Bookmark size={16}  fill={isSaved ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 border border-gray-100 rounded-md hover:bg-gray-50">
                  <Share2 size={16} />
                </button>
              </div>
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Image */}
          <div className="bg-white rounded-lg shadow p-4">
            {/* Main Image */}
            <div>
              <img
                src={mainImage}
                className="w-full h-90 object-cover rounded-lg"
                alt={property.property_title}
              />

              {/* Image thumbnails */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {thumbnails.map((img, i) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`bg-gray-100 border rounded-lg h-20 md:h-45 flex items-center justify-center cursor-pointer ${
                      selectedImage === i ? 'border-orange-500 border-2' : 'border-gray-100'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover rounded" alt={img.caption || `Image ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Buttons */}
            <div className="flex flex-col gap-2 p-4 border-t border-gray-100 mt-4">
              <p className="text-xs font-semibold text-gray-800">
                ₦{parseFloat(property.price).toLocaleString()}{property.price_period.toLowerCase().includes("month") ? "/mt" : property.price_period.toLowerCase().includes("year") ? "/yr" : ""}
              </p>
              <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                <button 
                  onClick={handleContactSeller}
                  className="flex flex-1 items-center justify-center gap-2 py-2 rounded-md bg-[#FCEEE7]"
                >
                  <Phone size={18} /> Contact Seller
                </button>
                <ChatButton listingType="property" listingId={property.id} ownerId={property.posted_by.id} />
              </div>
            </div>

            {/* Report Listing */}
            <div className="flex justify-end">
             
              <ReportListingModal 
  listingType="property" 
  listingId={property.id} 
/>
            </div>
          </div>

          {/* Property Description */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Property Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.property_description}
            </p>
          </div>

          {/* Property Details */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Property Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-500">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-500">Size</p>
                <p className="font-semibold">{property.size_sqm}m²</p>
              </div>
              <div>
                <p className="text-gray-500">Parking Spots</p>
                <p className="font-semibold">{property.parking_spots}</p>
              </div>
              <div>
                <p className="text-gray-500">Property Type</p>
                <p className="font-semibold">{property.property_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Listing Type</p>
                <p className="font-semibold">{property.listing_type}</p>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-3">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                {property.amenities.map((item, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly className="accent-green-600" /> {item}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Location</h2>
            <p className="text-sm text-gray-600 mb-3">{property.full_address}</p>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(property.full_address)}`}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Reviews Section */}
        <div className="w-full">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Safety Tip!!</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
              <li>Always verify property ownership</li>
              <li>Visit the property in person</li>
              <li>Never pay without proper documentation</li>
              <li>Report suspicious listings</li>
            </ul>
          </div>

          {/* ⭐ REVIEWS SECTION */}
          <div className="bg-white p-5 rounded-lg shadow mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Reviews</h3>
              {/* ⭐ WRITE REVIEW BUTTON */}
              {user && hasInquired && (
                <WriteReviewModal
                  targetType="property"
                  targetId={property.id}
                  onSuccess={handleReviewSubmit}
                />
              )}
            </div>

            {/* ⭐ SHOW MESSAGE IF NOT INQUIRED */}
            {user && !hasInquired && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                <p className="text-gray-700">
                  💡 You need to make an inquiry about this property before you can leave a review
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
            <p className="text-gray-600 text-sm mb-1">
              {ratingSummary?.count || 0} reviews for this Property
            </p>

            <div className="flex items-center gap-1 text-yellow-500 mb-1 gap-2">
              <span className="flex gap-1 items-center">
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
                    <span className="w-16">{s.label}</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div className="bg-yellow-500 h-2 rounded transition-all" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-gray-500 text-xs">({s.count})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ⭐ REVIEWS LIST */}
          <div className="bg-white p-5 rounded-lg shadow mt-4">
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

            {/* ⭐ REAL REVIEWS */}
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
                        <button
                          onClick={() => markHelpful(review.id, accessToken)}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          <ThumbsUp size={14} /> Helpful ({review.helpful_count})
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Home Listings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Latest Home Listings</h2>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latestProperties.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              image={p.thumbnail || "/Frame.png"}
              title={p.property_title}
              address={`${p.city}, ${p.state}`}
              beds={p.bedrooms}
              baths={p.bathrooms}
              area={`${p.size_sqm}m²`}
              price={`₦${parseFloat(p.price).toLocaleString()}`}
              period={p.price_period}
              propertyType={p.property_type}
              listingType={p.listing_type}
              viewCount={p.view_count}
              inquiryCount={p.inquiry_count}
            />
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal 
          property={property} 
          onClose={() => setShowInquiryModal(false)}
          onSuccess={handleInquirySuccess}
        />
      )}
    </div>
  );
};

// Inquiry Modal Component
function InquiryModal({ property, onClose, onSuccess }) {
  const { createInquiry, loading } = usePropertyStore();
  const { user, accessToken } = useUserStore();

  const [formData, setFormData] = useState({
    full_name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    message: "",
    budget: "",
    move_in_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inquiryData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      move_in_date: formData.move_in_date || null,
    };

    const result = await createInquiry(property.id, inquiryData, accessToken);

    if (result.success) {
      // ⭐ CALL onSuccess TO UPDATE hasInquired STATE
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Inquiry</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="Tell the owner why you're interested..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Budget (Optional)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="₦"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Move-in Date (Optional)</label>
            <input
              type="date"
              value={formData.move_in_date}
              onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyDetail;