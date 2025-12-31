import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useUserStore } from "../stores/userStore";
import { useNotificationStore } from "../stores/notificationStore"; // ✅ NEW
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ NEW

export default function Settings() {
  const { user, resendVerificationLink, updatePassword, updateEmail, logout } = useUserStore();
  const { preferences, fetchPreferences, updatePreferences, loading } = useNotificationStore(); // ✅ NEW
  const navigate = useNavigate();

  // ✅ Fetch notification preferences on mount
  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  // Password & Email modals
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

  // ✅ LOCAL STATE FOR NOTIFICATION PREFERENCES
  const [notificationSettings, setNotificationSettings] = useState({
    // Channels
    email_enabled: true,
    sms_enabled: false,
    
    // Bulk Notifications
    new_listings_enabled: true,
    new_listings_frequency: 'daily',
    new_listings_email: true,
    new_listings_sms: false,
    
    recommendations_enabled: true,
    recommendations_frequency: 'weekly',
    recommendations_email: true,
    recommendations_sms: false,
    
    newsletter_enabled: true,
    newsletter_email: true,
    
    marketing_enabled: false,
    marketing_email: true,
    marketing_sms: false,
    
    // Single Notifications
    admin_actions_email: true,
    admin_actions_sms: false,
    
    post_status_email: true,
    post_status_sms: false,
    
    saved_posts_email: true,
    
    received_applications_email: true,
    received_applications_sms: true,
    
    received_inquiries_email: true,
    received_inquiries_sms: true,
    
    sent_applications_email: true,
    
    message_notifications_enabled: true,
  });

  // ✅ Update local state when preferences are fetched
  useEffect(() => {
    if (preferences) {
      setNotificationSettings({
        email_enabled: preferences.email_enabled,
        sms_enabled: preferences.sms_enabled,
        
        new_listings_enabled: preferences.new_listings?.enabled,
        new_listings_frequency: preferences.new_listings?.frequency,
        new_listings_email: preferences.new_listings?.email,
        new_listings_sms: preferences.new_listings?.sms,
        
        recommendations_enabled: preferences.recommendations?.enabled,
        recommendations_frequency: preferences.recommendations?.frequency,
        recommendations_email: preferences.recommendations?.email,
        recommendations_sms: preferences.recommendations?.sms,
        
        newsletter_enabled: preferences.newsletter?.enabled,
        newsletter_email: preferences.newsletter?.email,
        
        marketing_enabled: preferences.marketing?.enabled,
        marketing_email: preferences.marketing?.email,
        marketing_sms: preferences.marketing?.sms,
        
        admin_actions_email: preferences.admin_actions?.email,
        admin_actions_sms: preferences.admin_actions?.sms,
        
        post_status_email: preferences.post_status?.email,
        post_status_sms: preferences.post_status?.sms,
        
        saved_posts_email: preferences.saved_posts?.email,
        
        received_applications_email: preferences.received_applications?.email,
        received_applications_sms: preferences.received_applications?.sms,
        
        received_inquiries_email: preferences.received_inquiries?.email,
        received_inquiries_sms: preferences.received_inquiries?.sms,
        
        sent_applications_email: preferences.sent_applications?.email,
        
        message_notifications_enabled: preferences.messages?.enabled,
      });
    }
  }, [preferences]);

  // ✅ Handle toggle
  const handleToggle = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Handle frequency change
  const handleFrequencyChange = (key, value) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Save notification preferences
  const handleSavePreferences = async () => {
    const result = await updatePreferences(notificationSettings);
    if (result.success) {
      toast.success("Notification preferences updated!");
    }
  };

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
              {user?.email_verified ? (
                <p className="text-gray-700 font-medium">Verified ✓</p>
              ) : (
                <p className="text-gray-700 font-medium text-red-500">Email Not Verified</p>
              )}
            </div>
            <button
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              onClick={() => resendVerificationLink(user?.email)}
            >
              Verify
            </button>
          </div>
        )}

        {/* Deactivate Account */}
        <button className="mt-4 text-red-600 hover:underline">
          Deactivate Account
        </button>
      </div>

      {/* ✅ COMPLETE NOTIFICATION PREFERENCES */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">
          Notification Preferences
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A3DD0] mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading preferences...</p>
          </div>
        ) : (
          <>
            {/* Main Channels */}
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <h4 className="font-medium text-gray-700">Notification Channels</h4>
              
              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <span className="font-medium">📧 Email Notifications</span>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleToggle('email_enabled')}
                  className={`relative w-11 h-6 rounded-full transition ${
                    notificationSettings.email_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                      notificationSettings.email_enabled ? "translate-x-5" : ""
                    }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <span className="font-medium">📱 SMS Notifications</span>
                  <p className="text-sm text-gray-500">Receive important notifications via SMS</p>
                </div>
                <button
                  onClick={() => handleToggle('sms_enabled')}
                  className={`relative w-11 h-6 rounded-full transition ${
                    notificationSettings.sms_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                      notificationSettings.sms_enabled ? "translate-x-5" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {/* New Listings */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">📄 New Listings Alerts</h4>
              
              <div className="flex items-center justify-between text-gray-700 mb-3">
                <span>Enable new listings notifications</span>
                <button
                  onClick={() => handleToggle('new_listings_enabled')}
                  className={`relative w-11 h-6 rounded-full transition ${
                    notificationSettings.new_listings_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                      notificationSettings.new_listings_enabled ? "translate-x-5" : ""
                    }`}
                  ></span>
                </button>
              </div>

              {notificationSettings.new_listings_enabled && (
                <div className="ml-4 space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Frequency</label>
                    <select
                      value={notificationSettings.new_listings_frequency}
                      onChange={(e) => handleFrequencyChange('new_listings_frequency', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                      <option value="monthly">Monthly Digest</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.new_listings_email}
                        onChange={() => handleToggle('new_listings_email')}
                        className="rounded"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.new_listings_sms}
                        onChange={() => handleToggle('new_listings_sms')}
                        className="rounded"
                      />
                      SMS
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">✨ Recommendations</h4>
              
              <div className="flex items-center justify-between text-gray-700 mb-3">
                <span>Personalized recommendations</span>
                <button
                  onClick={() => handleToggle('recommendations_enabled')}
                  className={`relative w-11 h-6 rounded-full transition ${
                    notificationSettings.recommendations_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                      notificationSettings.recommendations_enabled ? "translate-x-5" : ""
                    }`}
                  ></span>
                </button>
              </div>

              {notificationSettings.recommendations_enabled && (
                <div className="ml-4 space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Frequency</label>
                    <select
                      value={notificationSettings.recommendations_frequency}
                      onChange={(e) => handleFrequencyChange('recommendations_frequency', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.recommendations_email}
                        onChange={() => handleToggle('recommendations_email')}
                        className="rounded"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.recommendations_sms}
                        onChange={() => handleToggle('recommendations_sms')}
                        className="rounded"
                      />
                      SMS
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Important Notifications */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">🔔 Important Notifications</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Application received (Email)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.received_applications_email}
                    onChange={() => handleToggle('received_applications_email')}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Application received (SMS)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.received_applications_sms}
                    onChange={() => handleToggle('received_applications_sms')}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Inquiry received (Email)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.received_inquiries_email}
                    onChange={() => handleToggle('received_inquiries_email')}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Inquiry received (SMS)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.received_inquiries_sms}
                    onChange={() => handleToggle('received_inquiries_sms')}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Admin actions (Email)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.admin_actions_email}
                    onChange={() => handleToggle('admin_actions_email')}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Post status updates (Email)</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.post_status_email}
                    onChange={() => handleToggle('post_status_email')}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">💬 Messages (In-App Only)</h4>
              
              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <span>New message notifications</span>
                  <p className="text-xs text-gray-500">Shows in notification bell only (no email/SMS)</p>
                </div>
                <button
                  onClick={() => handleToggle('message_notifications_enabled')}
                  className={`relative w-11 h-6 rounded-full transition ${
                    notificationSettings.message_notifications_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                      notificationSettings.message_notifications_enabled ? "translate-x-5" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {/* Newsletter & Marketing */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-700 mb-3">📰 Newsletter & Marketing</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Newsletter</span>
                  <button
                    onClick={() => handleToggle('newsletter_enabled')}
                    className={`relative w-11 h-6 rounded-full transition ${
                      notificationSettings.newsletter_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                        notificationSettings.newsletter_enabled ? "translate-x-5" : ""
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Marketing emails</span>
                  <button
                    onClick={() => handleToggle('marketing_enabled')}
                    className={`relative w-11 h-6 rounded-full transition ${
                      notificationSettings.marketing_enabled ? "bg-[#2A3DD0]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                        notificationSettings.marketing_enabled ? "translate-x-5" : ""
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSavePreferences}
              disabled={loading}
              className="mt-6 w-full bg-[#2A3DD0] text-white px-6 py-3 rounded-lg hover:bg-[#1a2db0] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button 
        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Logout
      </button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4"
          style={{background:'#00000036'}}
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
                <label className="text-sm text-gray-600">Confirm New Password</label>
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

      {/* Email Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4"
          style={{background:'#00000036'}}
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