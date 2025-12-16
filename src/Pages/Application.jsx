import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useJobsStore } from "../stores/jobsstore";
import { useParams,useNavigate} from "react-router-dom";
export default function Application() {
   const { id } = useParams();
  const [step, setStep] = useState(1);
   const { user, accessToken } = useUserStore();
   const { applyJob  } = useJobsStore();
    const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    expectedSalary: "",
    portfolio: "",
    coverLetter: "",
  });

  // File state
  const [cvFile, setCvFile] = useState(null);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
  };
const handleSubmit = async () => {
  if (!accessToken) {
    alert("You must be logged in to apply.");
    return;
  }

  const fd = new FormData();
  fd.append("full_name", formData.fullName);
  fd.append("email", formData.email);
  fd.append("phone_number", formData.phone);
  fd.append("expected_salary", formData.expectedSalary);
  fd.append("portfolio_website", formData.portfolio || "");
  fd.append("cover_letter", formData.coverLetter);

  if (cvFile) {
    fd.append("cv_file", cvFile);
  }

  // jobId must come from route or props
  const jobId = id ; // Change this to dynamic id if needed

  const res = await applyJob(jobId, fd, accessToken);

  if (res.success) {
   // alert("Application submitted!");
   navigate("/success_application");
  } else {
   // alert(res.error || "Failed to submit application.");
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-3 md:px-4 pt-13  md:pt-22">
      <div className="max-w-2xl mx-auto ">

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-1">Apply for UI/UX Designer</h2>
        <p className="text-gray-500 mb-6">Your details will be shared with the employer</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2].map((num) => (
            <div key={num} className={`flex items-center ${num < 2 ? "w-full" : ""}`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= num ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 2 && (
                <div
                  className={`flex-1 h-0.5 ${
                    step > num ? "bg-orange-400" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <h3 className="text-lg font-bold ">Basic Information</h3>
            <p className="text-gray-500 text-sm mb-4">Tell your employer about yourself</p>

            <div className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                    placeholder="0812 345 6789"
                  />
                </div>
              </div>

              {/* Upload Resume */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Upload CV/ Resume <span className="text-red-500">*</span>
                </label>

                <label
                  htmlFor="cvUpload"
                  className="block  border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 cursor-pointer"
                >
                  <Upload className="mx-auto mb-2" size={24} />
                  {!cvFile ? (
                    <>
                      <p>Drop your files here</p>
                      <p className="text-sm text-blue-600 mt-1">Browse Files from your Computer</p>
                    </>
                  ) : (
                    <p className="font-semibold text-sm text-gray-700">{cvFile.name}</p>
                  )}
                </label>

                {/* Hidden input */}
                <input
                  id="cvUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Expected Salary<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                  placeholder="100,000 - 150,000"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Portfolio/ Website<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Cover Letter<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                  rows="15"
                  placeholder="Write your cover letter here..."
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Review */}
        {step === 2 && (
          <div className="p-6 bg-white rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold ">Review Application</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Review your details before submitting
                </p>
              </div>

              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                style={{ height: "fit-content" }}
              >
                Edit <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview fields */}
              <div>
                <label className="block text-sm font-bold mb-1">Full Name</label>
                <p className="text-gray-700">{formData.fullName}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Email</label>
                  <p className="text-gray-700">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Phone Number</label>
                  <p className="text-gray-700">{formData.phone}</p>
                </div>
              </div>

              {/* File preview */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Uploaded Resume</label>

                {cvFile ? (
                  <div className="border border-gray-300 rounded-md p-2 flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold border p-1 rounded">
                      {cvFile.name.split(".").pop().toUpperCase()}
                    </span>
                    <span>{cvFile.name}</span>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No file uploaded</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Expected Salary</label>
                <p className="text-gray-700">{formData.expectedSalary}</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Portfolio</label>
                <p className="text-gray-700">{formData.portfolio}</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Cover Letter</label>
                <p className="text-gray-700 whitespace-pre-line">
                  {formData.coverLetter}
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

          {step < 2 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1 bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}

              className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-md"
            >
              Submit for review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
