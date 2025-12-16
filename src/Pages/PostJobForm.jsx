import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Upload, CheckCircle, X, Star } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useJobsStore } from "../stores/jobsstore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Test data for states and cities
const nigeriaStates = [
  { name: "Lagos", cities: ["Ikeja", "Lekki", "Victoria Island", "Surulere"] },
  { name: "Abuja", cities: ["Garki", "Wuse", "Maitama", "Asokoro"] },
  { name: "Rivers", cities: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre"] },
  { name: "Kano", cities: ["Kano Municipal", "Fagge", "Dala", "Gwale"] },
  { name: "Oyo", cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin"] },
];

export default function PostJobForm() {
  const navigate = useNavigate();
  const { user, accessToken } = useUserStore();
  const { createJob, loading } = useJobsStore();
  const [step, setStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    category: "",
    job_type: "",
    full_address: "",
    state: "",
    city: "",
    job_description: "",
    requirements: "",
    key_responsibilities: "",
    benefits: "",
    experience_years: "",
    education: "",
    minimum_salary: "",
    maximum_salary: "",
    salary_period: "",
    application_method: "",
    external_link: "",
  });

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
      toast.error("Please login to post a job");
      navigate("/login");
      return;
    }

    // Validate required fields
    const requiredFields = [
      'job_title', 'company_name', 'category', 'job_type',
      'full_address', 'state', 'city', 'job_description',
      'requirements', 'experience_years', 'education',
      'minimum_salary', 'maximum_salary', 'salary_period',
      'application_method'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/_/g, ' ')}`);
        return;
      }
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
      if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    // Add images
    images.forEach((img, index) => {
      submitData.append(`image${index}`, img.file);
    });

    // Add thumbnail index
    submitData.append("thumbnail_index", thumbnailIndex);

    // Call Zustand store action
    const result = await createJob(submitData, accessToken);

    if (result.success) {
      // Redirect to my jobs page
      navigate("/jobs/my-posts");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13 md:pt-22">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-1">Post a Job</h2>
        <p className="text-gray-500 mb-6">Fill in the details to create your job listing</p>

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

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-bold">Basic Information</h3>
            <p className="text-gray-500 text-sm mb-4">Tell us about the job position</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  placeholder="e.g. Tech Corp Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="technology">Technology</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="design">Design</option>
                    <option value="graphics">Graphics</option>
                    <option value="customer_service">Customer service</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select job type</option>
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
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

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-medium">Job Details</h3>
            <p className="text-gray-500 mb-4">Provide detailed information about the role</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  rows="3"
                  placeholder="Describe the roles, responsibility, and what you are looking for.."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  rows="3"
                  placeholder="List the qualification, skills and experience needed.."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Key Responsibilities (optional)</label>
                <textarea
                  name="key_responsibilities"
                  value={formData.key_responsibilities}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  rows="3"
                  placeholder="List the main responsibilities.."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Benefits (optional)</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  rows="3"
                  placeholder="List the benefits and perks offered.."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Experience (years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Education <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                  >
                    <option value="">Select education</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Salary & Media */}
        {step === 3 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-medium">Salary & Media</h3>
            <p className="text-gray-500 mb-4">Set the salary range and upload media</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Minimum Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minimum_salary"
                    value={formData.minimum_salary}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Maximum Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maximum_salary"
                    value={formData.maximum_salary}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Salary Period <span className="text-red-500">*</span>
                </label>
                <select
                  name="salary_period"
                  value={formData.salary_period}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                >
                  <option value="">Select period</option>
                  <option value="per_month">Per month</option>
                  <option value="per_hour">Per hour</option>
                  <option value="per_year">Per year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Office Photos <span className="text-red-500">*</span>
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
            <p className="text-gray-500 mb-6">How should candidates reach you?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  Application Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="application_method"
                  value={formData.application_method}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm outline-none"
                >
                  <option value="">Select method</option>
                  <option value="phone">Via phone number</option>
                  <option value="email">Via email</option>
                  <option value="external_link">External link</option>
                  <option value="onsite"> Onsite</option>
                 
                </select>
              </div>

              {formData.application_method === "external_link" && (
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
                <CheckCircle className="text-blue-500 mt-0.5" size={24} />
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