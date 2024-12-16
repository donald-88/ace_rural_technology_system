"use client";

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/lib/types";
import React, { useState } from "react";

const WarehouseAccess = () => {
  // State to manage the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [reason, setReason] = useState("");

  // Handler for opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const closeModal = () => {
    setIsModalOpen(true);
    setReason(""); // Reset the reason field when closing the modal
  };

  // Handler for submitting the request
  const handleRequest = () => {
    console.log("Reason for access:", reason);

    // Add logic to send the request to the administrator here (e.g., API call)
    alert("Request sent to the administrator!");

    closeModal();
  };

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-xl font-bold mb-4">Request Access</h2>
            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              rows="4"
              placeholder="Enter your reason for requesting access..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={closeModal}
                className="bg-gray-500 text-white hover:bg-gray-600 mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleRequest}>Request Access</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseAccess;
