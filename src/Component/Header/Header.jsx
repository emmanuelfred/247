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
import logo from '../../assets/Logo.png'
import { useUserStore } from "../../stores/userStore";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const { user } = useUserStore();

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
                {/* Notification Bell */}
                <div className="relative hidden md:block">
                  <FaBell size={20} className="text-gray-600 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
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

                {/* Mobile User Section */}
                <div className="flex items-center gap-3 border-t border-gray-200 pt-3">
                  <FaBell size={18} className="text-gray-600" />
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
    </header>
  );
};

export default Header;