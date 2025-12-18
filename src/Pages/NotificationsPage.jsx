/**
 * NOTIFICATIONS PAGE
 * File: src/Pages/NotificationsPage.jsx
 * 
 * Full page to view and manage all notifications
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheck, FaTrash, FaFilter } from "react-icons/fa";
import { useNotificationStore } from "../stores/notificationStore";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    pagination,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotificationStore();

  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch notifications on mount and when filter/page changes
  useEffect(() => {
    fetchNotifications(currentPage, filterType);
  }, [currentPage, filterType]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read
    await markAsRead(notification.id);
    
    // Navigate to action URL if exists
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      fetchNotifications(currentPage, filterType);
    }
  };

  // Handle delete notification
  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    
    if (window.confirm('Delete this notification?')) {
      const result = await deleteNotification(notificationId);
      if (result.success) {
        fetchNotifications(currentPage, filterType);
      }
    }
  };

  // Handle delete all read
  const handleDeleteAllRead = async () => {
    if (window.confirm('Delete all read notifications?')) {
      const result = await deleteAllRead();
      if (result.success) {
        fetchNotifications(currentPage, filterType);
      }
    }
  };

  // Format time since
  const formatTimeSince = (timeString) => {
    return timeString || 'just now';
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" style={{marginTop:90}}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaBell className="text-[#2A3DD0]" />
                Notifications
              </h1>
              <p className="text-gray-500 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 bg-[#2A3DD0] text-white px-4 py-2 rounded-lg hover:bg-[#1a2db0] transition"
              >
                <FaCheck />
                Mark All Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 border-t pt-4">
            <button
              onClick={() => {
                setFilterType('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'all'
                  ? 'bg-[#E1E5FF] text-[#2A3DD0]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({pagination.total_count || 0})
            </button>

            <button
              onClick={() => {
                setFilterType('unread');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'unread'
                  ? 'bg-[#E1E5FF] text-[#2A3DD0]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              onClick={() => {
                setFilterType('read');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'read'
                  ? 'bg-[#E1E5FF] text-[#2A3DD0]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Read
            </button>

            {filterType === 'read' && notifications.length > 0 && (
              <button
                onClick={handleDeleteAllRead}
                className="ml-auto flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition"
              >
                <FaTrash />
                Delete All Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A3DD0] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition ${
                  !notification.is_read ? 'border-l-4 border-[#2A3DD0] bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon/Badge */}
                  <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(notification.priority)}`}></div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      
                      {/* Priority Badge */}
                      {(notification.priority === 'urgent' || notification.priority === 'high') && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          notification.priority === 'urgent'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>🕐 {formatTimeSince(notification.time_since)} ago</span>
                        
                        {notification.sent_email && (
                          <span className="flex items-center gap-1">
                            📧 Email sent
                          </span>
                        )}
                        
                        {notification.sent_sms && (
                          <span className="flex items-center gap-1">
                            📱 SMS sent
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.action_url && (
                          <button
                            className="text-sm text-[#2A3DD0] hover:underline"
                          >
                            {notification.action_text || 'View'}
                          </button>
                        )}

                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaBell size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filterType === 'unread'
                ? "You're all caught up!"
                : 'No notifications to show'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.has_previous}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <span className="text-gray-600">
              Page {currentPage} of {pagination.total_pages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.has_next}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}