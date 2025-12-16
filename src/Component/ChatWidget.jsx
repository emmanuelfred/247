import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
    

      {/* Chat Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-96 bg-white rounded-xl shadow-2xl  flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 ">
              <div className="flex items-center space-x-2">
                <img
                  src="/bot-circle.png"
                  alt="Bot"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-semibold text-gray-700">
                  Chat with us
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600 px-4">
              <div className="relative mb-3">
                <div className="absolute inset-0  rounded-full blur-2xl opacity-40"></div>
                <img
                  src="/bot-circle.png"
                  alt="Bot Circle"
                  className="relative w-32 h-32 object-contain"
                />
              </div>
              <p className="text-sm font-medium">
                How can we help you today
              </p>
            </div>

            {/* Footer / Input */}
            <div className="p-3  flex items-center space-x-2">
                <img src="./file.png" alt="" />
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here"
                className="flex-1 px-3 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <img src="./recorder.png" alt="" />
              <img src="./send.png" alt="" />
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        {!open &&
       (
        <div className="" style={{width:'100%',textAlign:'right'}}>
                <button
          onClick={() => setOpen(true)}
          className="hadow-lg rounded-full  hover:shadow-xl transition w-15 h-15 "

        >
          <img
            src="/bot-icon.png"
            alt="Chat Icon"
            className="w-20 h-20 object-contain"
          />
        </button>

        </div>
    
      )}
    </div>
  );
}
