"use client";

import React, { useState } from "react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState("CSV"); // Default export format

  if (!isOpen) return null; // Do not render the modal if it's closed

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking on the background
    >
      <div
        className="bg-white rounded-lg p-6 w-80 relative"
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-lg font-semibold mb-4">Export Report</h2>

        {/* Dropdown for format selection */}
        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
          Format
        </label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        >
          <option value="CSV">CSV</option>
          <option value="PDF">PDF</option>
          <option value="XLSX">XLSX</option>
        </select>

        {/* Download Button */}
        <button
          onClick={() => {
            alert(`Exporting report as ${format}`);
            onClose();
          }}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
