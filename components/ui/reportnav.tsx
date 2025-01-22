"use client";
import { useState } from "react";

// Define a type for the valid tab names
type TabName = "Warehouse" | "Inventory";

// Define the type for the links object
type LinksType = {
  [K in TabName]: string[];
};

export default function Reportnav() {
  const [activeTab, setActiveTab] = useState<TabName>("Inventory");

  // Define links with the correct type
  const links: LinksType = {
    Warehouse: ["Warehouse Overview", "Storage Units", "Safety Protocols"],
    Inventory: ["Customer Reports"],
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-gray-300 space-x-6 mr-8">
        {(["Warehouse", "Inventory"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)} // Update active tab on click
            className={`text-sm font-small pb-1 ${
              activeTab === tab
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Links Section */}
      <div className="mt-4 space-y-2 text-left">
        {links[activeTab].map((link: string, index: number) => (
          <div
            key={index}
            className="text-gray-700 hover:text-green-500 cursor-pointer"
          >
            {link}
          </div>
        ))}

        {/* Filter and Export Buttons */}
        {activeTab === "Inventory" && (
          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-transparent text-gray-700 hover:text-gr border border-gray-300 px-4 py-2 rounded-md">
              Filter
            </button>
            <button className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">
              Export
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      {activeTab === "Inventory" && (
        <div className="mt-6">
          <table className="w-full table-auto border-collapse border border-gray-300">
            {/* Table Header */}
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="px-4 py-2">CUSTOMER NAME</th>
                <th className="px-4 py-2">INTAKE DATE</th>
                <th className="px-4 py-2">COMMODITY</th>
                <th className="px-4 py-2">VARIETY</th>
                <th className="px-4 py-2">QUANTITY (Bags)</th>
                <th className="px-4 py-2">NET WEIGHT (Kg)</th>
                <th className="px-4 py-2">MOISTURE</th>
                <th className="px-4 py-2">GRADE</th>
                <th className="px-4 py-2">VEHICLE REG</th>
                <th className="px-4 py-2">ACC DETAILS</th>
              </tr>
            </thead>
            {/* Table Body Placeholder */}
            <tbody>
              <tr>
                <td
                  colSpan={10}
                  className="text-center text-gray-500 py-4 italic"
                >
                  Table data will be loaded here from the database.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
