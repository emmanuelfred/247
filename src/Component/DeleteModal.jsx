import React from "react";
import { createPortal } from "react-dom";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[400px] md:w-[460px] rounded-2xl shadow-lg text-center p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this listing
        </p>

        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/delete-illustration.png"
            alt="Delete illustration"
            className="w-60 h-auto"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
