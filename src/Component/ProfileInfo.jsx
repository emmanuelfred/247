import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useUserStore } from "../stores/userStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function ProfileInfo() {
  const { user, saveChanges,logout } = useUserStore();
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    surname: user?.surname || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    location: user?.location || "",
  });

  if (!user) return <p className="text-center">Loading...</p>;

  const fullName = `${user.first_name || ""} ${user.surname || ""} ${
    user.last_name || ""
  }`.trim();

  const identity = user.identity;

  let statusBadge = (
    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
      Not Submitted
    </span>
  );

  if (identity) {
    if (identity.verified) {
      statusBadge = (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Verified
        </span>
      );
    } else {
      statusBadge = (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          Pending
        </span>
      );
    }
  }

  // -----------------------------------------
  // SAVE CHANGES HANDLER
  // -----------------------------------------
  const handleSave = async () => {
    const loading = toast.loading("Saving changes...");
    console.log("Form data to save:", form);

    const res = await saveChanges(form);

    if (res.success) {
      toast.success("Profile updated!", { id: loading });
      setEditing(false);
    } else {
      toast.error(res.error || "Failed to update profile", { id: loading });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">Basic Information</h3>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">First Name</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Surname</label>
              <input
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
              <input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
              />
            </div>
          </div>
        ) : (
          // Read-only mode
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <input
                value={fullName}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                value={user.email}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
              <input
                value={user.phone_number || "Not provided"}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Location</label>
              <input
                value={user.location || "Not provided"}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-400"
                readOnly
              />
            </div>
          </div>
        )}

        {/* Button */}
        {editing ? (
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="mt-4 flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            <FiEdit2 size={16} />
            Edit
          </button>
        )}
      </div>

      {/* Verification Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">Verification</h3>

        <div className="text-sm text-gray-600 space-y-2">
          <p>Status: {statusBadge}</p>

          {identity ? (
            <>
              <p>Date of Birth: {identity.date_of_birth}</p>
              <p>Gender: {identity.gender}</p>
              <p>Address: {identity.address}</p>

              <p>Submitted: {new Date(identity.submitted_at).toLocaleString()}</p>

              <a
                href={identity.id_document}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                View ID Document
              </a>
            </>
          ) : (
            <div>
              <p className="text-red-600">You have not submitted identity verification.</p>

              <Link
                to={`/verify_identity/${user.id}`}
                className="inline-block mt-2 px-4 py-2 bg-orange-500 text-white rounded-md"
              >
                Verify Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"onClick={()=>{
        logout()
        navigate('/login')
      }}>
        Logout
      </button>
    </div>
  );
}
