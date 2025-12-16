import React from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#DADAFE] text-gray-800 py-12 px-6">
      {/* Top Section */}
       {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="./247-Nigeria.png" alt="" />
          
        </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-start">
       

        {/* Newsletter */}
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="font-semibold text-lg mb-2">Subscribe To Our Newsletter</h2>
          <p className="text-sm text-gray-600 mb-4">
            Stay in the loop with the latest listings opportunities, and updates
          </p>
          <div className="flex bg-white rounded-full overflow-hidden shadow-sm w-full  p-2" style={{width:'100%'}}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 outline-none text-sm"
              style={{minWidth:10}}
            />
            <button className="bg-[#F6A35A] text-white px-5 text-sm font-medium hover:bg-[#e6934a] transition rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:block pl-10">
          <h3 className="font-semibold text-lg mb-2">Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-[#2A3DD0]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#2A3DD0]">Terms of Use</a></li>
            <li><a href="#" className="hover:text-[#2A3DD0]">FAQ</a></li>
          </ul>
        </div>

        {/* App Links */}
        <div className="flex flex-row space-y-4 gap-6  items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <FaGooglePlay className="text-2xl" />
              <div>
                <p className="text-xs text-gray-500">GET IT ON</p>
                <p className="font-medium">Google Play</p>
                
              </div>
            </div>
            <img
              src="/qrcode-google.jpg"
              alt="Google Play QR"
              className="w-25 h-25 rounded-md"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2">
              <FaApple className="text-2xl" />
              <div>
                <p className="text-xs text-gray-500">GET IT ON</p>
                <p className="font-medium">Apple Store</p>
                
              </div>
            </div>
             <img
              src="/qrcode-apple.jpg"
              alt="Apple Store QR"
              className="w-25 h-25 rounded-md"
            />
          </div>

          
        </div>
        <div className="block md:hidden ">
         
          <ul className=" flex justify-center gap-10 space-y-2 text-sm text-[#2A3DD0]">
            <li><a href="#" className="hover:text-[#2A3DD0]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#2A3DD0]">Terms of Use</a></li>
            <li><a href="#" className="hover:text-[#2A3DD0]">FAQ</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm text-gray-600">
        ©247 Nigeria. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
