import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const { user, resendVerificationLink, updatePassword, updateEmail,logout } =
    useUserStore();
      const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    jobUpdates: false,
    propertyRecommendations: false,
    messageAlerts: false,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

   const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
  
    const [passwordForm, setPasswordForm] = useState({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
  
    const [emailForm, setEmailForm] = useState({
      email: user?.email || "",
    });
  
    const handlePasswordSubmit = (e) => {
      e.preventDefault();
      updatePassword(passwordForm);
    };
  
    const handleEmailSubmit = (e) => {
      e.preventDefault();
      updateEmail(emailForm.email);
    };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Account Settings</h3>
         {/* Update Password */}
               <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                 <div>
                   <p className="text-gray-700 font-medium">Update Password</p>
                 </div>
                 <button
                   className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                   onClick={() => setShowPasswordModal(true)}
                 >
                   <FiEdit2 size={16} />
                   Edit
                 </button>
               </div>
       
               {/* Update Email */}
               <div className="pt-4 flex items-center justify-between">
                 <div>
                   <p className="text-gray-700 font-medium">Update Email</p>
       
                  
                 </div>
       
                 <button
                   className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                   onClick={() => setShowEmailModal(true)}
                 >
                   <FiEdit2 size={16} />
                   Edit
                 </button>
               </div>
       
               {/* Resend Verification Email */}
               {!user?.email_verified && (
                  <div className="pt-4 flex items-center justify-between">
                 <div>
                  
       
                   {/* Verification Status */}
                   {user?.email_verified ? (
                     <p className="text-gray-700 font-medium">Verified ✓</p>
                   ) : (
                      <p className="text-gray-700 font-medium text-red-500 ">Email Not Verified</p>
                     
                   )}
                 </div>
       
                 <button
                   className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => resendVerificationLink(user?.email)}
                 >
              
                    Verifiy
                 </button>
               </div>
               
               )}
       
               {/* Deactivate Account */}
               <button className="mt-4 text-red-600 hover:underline">
                 Deactivate Account
               </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">
          Notification Preferences
        </h3>
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {[
            { key: "jobUpdates", label: "Job Updates" },
            { key: "propertyRecommendations", label: "Property Recommendations" },
            { key: "messageAlerts", label: "Message Alerts" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between text-gray-700"
            >
              <span>{item.label}</span>
              <button
                onClick={() => handleToggle(item.key)}
                className={`relative w-11 h-6 rounded-full transition ${
                  notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                    notifications[item.key] ? "translate-x-5" : ""
                  }`}
                ></span>
              </button>
            </div>
          ))}
        </div>
         <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50">
          update  Notification Preferences
         </button>

      </div>

      {/* Logout Button */}
      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
      onClick={()=>{
        logout()
        navigate('/login')
      }}>
        Logout
      </button>



           {/* ===================== PASSWORD MODAL ===================== */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Update Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="text-sm text-gray-600">Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current_password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      new_password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={passwordForm.confirm_new_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm_new_password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg font-semibold"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EMAIL MODAL ===================== */}
      {showEmailModal && (
        <div
          className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Update Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="text-sm text-gray-600">Current Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-gray-600">New Email</label>
                <input
                  type="email"
                  name="email"
             
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg font-semibold"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
