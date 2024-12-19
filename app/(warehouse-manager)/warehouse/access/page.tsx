"use client";

import { Button } from "@/components/ui/button";
import { sendRequestAction } from "./actions"; // Adjusted import path
import React, { useState } from "react";

const WarehouseAccess = () => {
  // State to manage the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [datetime, setDateOfUse] = useState(""); // Stores the date as a string initially
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setReason("");
    setDateOfUse("");
    setUserName("");
  };

  // Handler for submitting the request
  const handleRequest = async () => {
    if (!reason || !datetime || !userName) {
      alert("Please fill out all fields before submitting the request.");
      return;
    }

    setIsSubmitting(true);

    // Convert the date string into a Date object
    const datetimeAsDate = new Date(datetime);

    // Validate the Date object
    if (isNaN(datetimeAsDate.getTime())) {
      alert("Invalid date provided. Please select a valid date.");
      setIsSubmitting(false);
      return;
    }

    const intakeData = {
      user_id: "12345", // Replace with dynamic user ID if available
      reason,
      datetime: datetimeAsDate, // Pass the Date object
      otp: "", // Replace with a dynamically generated OTP if needed
      device_id: "SP2X18346b05", // Replace with actual device ID
      name: userName,
      role: "User", // Replace with dynamic role if available
    };

    try {
      const response = await sendRequestAction(intakeData);

      if (response.success) {
        alert("Request successfully sent!");
        closeModal();
      } else {
        alert(`Failed to send request: ${response.message}`);
      }
    } catch (error) {
      console.error("Error while sending request:", error);
      alert("An error occurred while sending your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Button to open the modal */}
      <Button onClick={openModal}>Request Warehouse Access</Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-xl font-bold mb-4">Request Access</h2>

            <input
              type="text"
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              type="date"
              className="w-full border rounded-lg p-2 mb-4"
              value={datetime}
              min={getToday()}
              onChange={(e) => setDateOfUse(e.target.value)}
            />

            <textarea
              className="w-full border rounded-lg p-2 mb-4"
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
              <Button onClick={handleRequest} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Access"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseAccess;
