import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Upload, CheckCircle, X, Star } from "lucide-react";


import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/userStore";
import { usePropertyStore } from "../stores/Propertystore";

// Nigeria states and cities data
const nigeriaStates = [
  { name: "Lagos", cities: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Ikoyi"] },
  { name: "Abuja", cities: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa"] },
  { name: "Rivers", cities: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre"] },
  { name: "Kano", cities: ["Kano Municipal", "Fagge", "Dala", "Gwale"] },
  { name: "Oyo", cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin"] },
];

// Available amenities
const availableAmenities = [
  "Swimming Pool",
  "Home Office",
  "Pet-Friendly",
  "Balcony",
  "Parking Space",
  "Garden",
  "Walk-in Closet",
  "Air Conditioning",
  "Laundry Room",
  "Security System",
  "Basement",
  "Gym",
  "Fireplace",
  "Smart Home Features",
  "Roof Deck",
  "Elevator",
];

export default function PostPropertyForm() {
  const navigate = useNavigate();
  const { user, accessToken } = useUserStore();
  const { createProperty, loading } = usePropertyStore();
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    property_title: "",
    property_type: "",
    listing_type: "",
    full_address: "",
    state: "",
    city: "",
    bedrooms: 0,
    bathrooms: 0,
    size_sqm: 0,
    parking_spots: 0,
    property_description: "",
    furnishing_status: "",
    price: "",
    price_period: "",
    contact_method: "",
    external_link: "",
  });

  // Amenities state
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Image handling
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData((prev) => ({ ...prev, state, city: "" }));

    const stateData = nigeriaStates.find((s) => s.name === state);
    setCities(stateData ? stateData.cities : []);
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (thumbnailIndex === index) {
      setThumbnailIndex(0);
    } else if (thumbnailIndex > index) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate user is logged in
    if (!user || !accessToken) {
      toast.error("Please login to post a property");
      navigate("/login");
      return;
    }

    // Validate required fields
    const requiredFields = [
      'property_title', 'property_type', 'listing_type',
      'full_address', 'state', 'city', 'property_description',
      'furnishing_status', 'price', 'price_period', 'contact_method'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/_/g, ' ')}`);
        return;
      }
    }

    // Validate numeric fields
    if (formData.bedrooms < 0 || formData.bathrooms < 0 || formData.size_sqm <= 0 || formData.parking_spots < 0) {
      toast.error("Please enter valid property details");
      return;
    }

    // Validate images
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Create FormData
    const submitData = new FormData();

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Add amenities as JSON string
    submitData.append("amenities", JSON.stringify(selectedAmenities));

    // Add images
    images.forEach((img, index) => {
      submitData.append(`image${index}`, img.file);
    });

    // Add thumbnail index
    submitData.append("thumbnail_index", thumbnailIndex);

    // Call Zustand store action
    const result = await createProperty(submitData, accessToken);

    if (result.success) {
      // Redirect to my properties page
      navigate("/success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-1">Post a Property</h2>
        <p className="text-gray-500 mb-6">Fill in the details to create your property listing</p>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={`flex items-center ${num < 4 ? "w-full" : ""}`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= num ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div className={`flex-1 h-0.5 ${step > num ? "bg-orange-400" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Property Information */}
        {step === 1 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-bold">Property Information</h3>
            <p className="text-gray-500 text-sm mb-4">Tell us about your property</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="property_title"
                  value={formData.property_title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  placeholder="e.g. Three bedroom apartment in Lekki"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="land">Land</option>
                    <option value="commercial_building">Commercial Building</option>
                    <option value="office_space">Office Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="listing_type"
                    value={formData.listing_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select Listing Type</option>
                    <option value="for_rent">For Rent</option>
                    <option value="for_sale">For Sale</option>
                    <option value="for_lease">For Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  placeholder="e.g. 123 Main Street, Building 5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select state</option>
                    {nigeriaStates.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!selectedState}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 2 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-medium">Property Details</h3>
            <p className="text-gray-500 mb-4">Provide detailed information about the property</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700 mb-3">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Size (sqm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="size_sqm"
                    value={formData.size_sqm}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Parking spots <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="parking_spots"
                    value={formData.parking_spots}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Property Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="property_description"
                  value={formData.property_description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  rows="3"
                  placeholder="Describe your property, view, details.."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Amenities <span className="text-gray-500 font-normal">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  {availableAmenities.map((amenity, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="accent-green-600"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Furnishing Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="furnishing_status"
                  value={formData.furnishing_status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                >
                  <option value="">Select Furnishing Status</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Price & Media */}
        {step === 3 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-medium">Price & Media</h3>
            <p className="text-gray-500 mb-4">Set the price and upload media</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  placeholder="₦1,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Price Period <span className="text-red-500">*</span>
                </label>
                <select
                  name="price_period"
                  value={formData.price_period}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                >
                  <option value="">Select period</option>
                  <option value="per_month">Per Month</option>
                  <option value="per_year">Per Year</option>
                  <option value="one_time">One Time Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Property Photos & Videos <span className="text-red-500">*</span>
                </label>

                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <label
                  htmlFor="imageUpload"
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 cursor-pointer hover:border-orange-400 block"
                >
                  <Upload className="mx-auto mb-2" size={24} />
                  <p>Drop your files here or click to browse</p>
                  <p className="text-sm text-blue-600 mt-1">Select multiple images</p>
                </label>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => setThumbnailIndex(index)}
                          className={`absolute bottom-2 left-2 p-1 rounded ${
                            thumbnailIndex === index
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-700"
                          }`}
                        >
                          <Star size={16} fill={thumbnailIndex === index ? "white" : "none"} />
                        </button>
                        {thumbnailIndex === index && (
                          <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact Information */}
        {step === 4 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-bold">Contact Information</h3>
            <p className="text-gray-500 mb-6">How should interested parties reach you?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Contact Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="contact_method"
                  value={formData.contact_method}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                >
                  <option value="">Select method</option>
                  <option value="phone">Via Phone Number</option>
                  <option value="email">Via Email</option>
                  <option value="external_link">External Link</option>
                </select>
              </div>

              {formData.contact_method === "external_link" && (
                <div>
                  <label className="block text-sm font-bold mb-1">
                    External Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="external_link"
                    value={formData.external_link}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-2">
                <CheckCircle className="text-blue-500 mt-0.5" size={35} />
                <p className="text-sm text-blue-700">
                  Your listing will be reviewed by our team within 24 hours before going live. You'll
                  receive a notification once it's approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1 bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit for review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}