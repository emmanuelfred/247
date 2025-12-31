import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBriefcase,
  FaBuilding,
  FaFolderOpen,
  FaComments,
  FaUser,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from '../../assets/Logo.png';
import { useUserStore } from "../../stores/userStore";
import { useNotificationStore } from "../../stores/notificationStore"; // ✅ NEW

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false); // ✅ NEW
  const jsx="true";
  const { user } = useUserStore();
  const { unreadCount, notifications, fetchUnreadCount, fetchNotifications, markAsRead } = useNotificationStore(); // ✅ NEW

  // ✅ Fetch unread count on mount and every 30 seconds
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchNotifications(1, 'all', 10); // Get last 10 for dropdown
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchNotifications(1, 'all', 10);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Get user initials for fallback
  const getInitials = () => {
    if (!user) return "??";
    const firstInitial = user.surname?.[0] || "";
    const lastInitial = user.first_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Detect scroll to toggle background and shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Handle notification click
  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setShowNotificationDropdown(false);
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotificationDropdown && !event.target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationDropdown]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 z-10 md:z-40`}
    >
      <div className={`transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      } ${
        isMenuOpen ? "hidden" : "block"
      }`}>
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <a href="./home" className="text-2xl font-extrabold text-gray-800">
            <img src={logo} alt="" style={{width:110}} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className={`flex items-center gap-2 transition-all duration-300  ${
                active === "home"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('home')}
            >
              <FaHome size={16} />
              Home
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "job"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('job')}
            >
              <FaBriefcase size={16} />
              Jobs
            </Link>

            <Link
              to="/properties"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "properties"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('properties')}
            >
              <FaBuilding size={16} />
              Properties
            </Link>

            <Link
              to="/mylisting"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "listing"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('listing')}
            >
              <FaFolderOpen size={16} />
              My Listings
            </Link>

            <Link
              to="/chat"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "chat"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('chat')}
            >
              <FaComments size={16} />
              Chats
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "profile"
                  ? "bg-[#E1E5FF] text-[#2A3DD0] px-4 py-2 rounded-full font-medium"
                  : "text-gray-500 hover:text-[#2A3DD0]"
              }`}
              onClick={() => setActive('profile')}
            >
              <FaUser size={16} />
              Profile
            </Link>
          </nav>

          {/* Right Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* ✅ NOTIFICATION BELL WITH DROPDOWN */}
                <div className="relative hidden md:block notification-dropdown">
                  <button
                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                    className="relative focus:outline-none"
                  >
                    <FaBell size={20} className="text-gray-600 cursor-pointer hover:text-[#2A3DD0] transition" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotificationDropdown && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <Link
                            to="/notifications"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => setShowNotificationDropdown(false)}
                          >
                            View all
                          </Link>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto max-h-[400px]">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 10).map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left p-4 hover:bg-gray-50 border-b transition ${
                                !notification.is_read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time_since}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <FaBell size={32} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No notifications yet</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t text-center bg-gray-50">
                        <Link
                          to="/notifications"
                          className="text-sm text-[#2A3DD0] hover:text-[#1a2db0] font-medium"
                          onClick={() => setShowNotificationDropdown(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Picture or Initials */}
                <Link to="/profile" className="hidden md:block">
                  {user.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[#2A3DD0] font-bold text-sm">
                      {getInitials()}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                {/* Login & Signup Buttons for non-logged-in users */}
                <Link
                  to="/login"
                  className="hidden md:block border-2 border-[#F2954D] px-6 py-2 rounded-full text-[#F2954D] hover:bg-[#F2954D] hover:text-white font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:block bg-[#F2954D] border-2 border-[#F2954D] text-white px-6 py-2  rounded-full font-medium hover:bg-transparent transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden bg-white shadow-lg transition-all duration-300 rounded-lg`}
          style={{width:'calc(100% - 20px)', margin:'10px'}}
        >
          <button
            className="md:hidden text-gray-700 w-full flex justify-end p-3"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
          
          <nav className="flex flex-col space-y-4 p-6 pt-0 pl-10">
            <Link
              to="/home"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "home"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('home');
                setIsMenuOpen(false);
              }}
            >
              <FaHome size={16} />
              Home
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "job"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('job');
                setIsMenuOpen(false);
              }}
            >
              <FaBriefcase size={16} />
              Jobs
            </Link>

            <Link
              to="/properties"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "properties"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('properties');
                setIsMenuOpen(false);
              }}
            >
              <FaBuilding size={16} />
              Properties
            </Link>

            <Link
              to="/mylisting"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "listing"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('listing');
                setIsMenuOpen(false);
              }}
            >
              <FaFolderOpen size={16} />
              My Listings
            </Link>

            <Link
              to="/chat"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "chat"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('chat');
                setIsMenuOpen(false);
              }}
            >
              <FaComments size={16} />
              Chats
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 transition-all duration-300 ${
                active === "profile"
                  ? "text-[#2A3DD0] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActive('profile');
                setIsMenuOpen(false);
              }}
            >
              <FaUser size={16} />
              Profile
            </Link>

            {user ? (
              <>
                {/* ✅ Mobile Notification Link */}
                <Link
                  to="/notifications"
                  className="flex items-center gap-2 text-gray-600 border-t border-gray-200 pt-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative">
                    <FaBell size={18} className="text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  Notifications
                </Link>

                {/* Mobile User Section */}
                <div className="flex items-center gap-3">
                  {user.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[#2A3DD0] font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Mobile Login/Signup */}
                <Link
                  to="/login"
                  className="text-center border-2 border-[#F2954D] px-6 py-2 rounded-full text-[#F2954D] hover:bg-[#F2954D] hover:text-white font-medium transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-center bg-[#F2954D] border-2 border-[#F2954D] text-white px-6 py-2  rounded-full font-medium hover:bg-transparent transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
     
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </header>
  );
};

export default Header;