import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import toast, { Toaster } from "react-hot-toast";


export default function IdentityVerification() {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { identityVerification, loading } = useUserStore();
  

  const [form, setForm] = useState({
    dob: "",
    gender: "Female",
    address: "",
    document: null,
  });

  const [preview, setPreview] = useState(null); // preview URL

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, document: file }));

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview({ url: fileURL, name: file.name, type: file.type });
    } else {
      setPreview(null);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setForm((prev) => ({ ...prev, document: null }));
    setPreview(null);
  };

const decodeID = (encoded) => {
  try {
    const decoded = atob(encoded);
    const id = decoded.split("-")[0]; // remove salt
    return Number(id);
  } catch (e) {
    return null; // invalid format
  }
};

// Usage
// 123
const decodedUserId = decodeID(user_id);
console.log(decodedUserId);



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.document) {
    toast.error("Please upload a valid ID document.");
    return;
  }

  if (!form.dob || !form.gender || !form.address) {
    toast.error("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("id_document", form.document);
  formData.append("date_of_birth", form.dob);
  formData.append("gender", form.gender);
  formData.append("address", form.address);

  const res = await identityVerification(decodedUserId, formData);

  if (!res.success) {
    toast.error(res.error?.message || "Failed to submit identity verification.");
    return; // stop navigation
  }

  toast.success(res.message || "Identity verification submitted successfully!");
  navigate("/profile");
};



  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(#0000003c,#0000003c),url('/bg.jpg')",
      }}
    >
      <Toaster position="top-center" />
      <div className="relative z-10 bg-white/95 rounded-2xl shadow-lg w-full md:max-w-5/12 p-8 m-4">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Let’s verify your identity
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Your details help us confirm you’re real and trusted
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* File Upload */}
            <div className="mt-4">
              <label className="block text-sm font-bold mb-2">
                Upload valid ID document <br />
                <span className="text-gray-400 font-medium">
                  Upload driver’s license, passport, NIN, etc.
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 py-8 text-center text-gray-500 cursor-pointer relative">
                <Upload className="mx-auto mb-2" size={24} />
                <p>Drop your files here</p>
                <p className="text-sm text-blue-600 mt-1 cursor-pointer">
                  Browse Files from your Computer
                </p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-4 flex items-center justify-between border border-gray-300 p-2 rounded-md bg-gray-50">
                  {preview.type.startsWith("image/") ? (
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 truncate">{preview.name}</p>
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Other Fields */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-400 text-sm outline-none"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="eg.. No1 Egim Str, Abakaliki, Ebonyi State"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 rounded-md transition"
            >
              {loading ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
