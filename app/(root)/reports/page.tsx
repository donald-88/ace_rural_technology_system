"use client";

import { useState, useEffect } from "react";
import { getDispatch } from "@/lib/actions/dispatch.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ExportModal from "@/components/exportModal"; // Import the modal
import { Filter, Download } from "lucide-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Inventory");
  const [intake, setIntake] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDispatch();
        setIntake(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="container mx-auto p-4">
      {/* Tabs Section */}
      <div className="flex border-b border-gray-300 space-x-6 mb-4">
        {["Warehouse", "Inventory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-1 transition ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Title & Buttons */}
      {activeTab === "Inventory" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm text-gray-700">Customer reports</h2>
            <div className="flex space-x-2">
              {/* Filter Button */}
              <button className="flex items-center border border-gray-300 text-gray-600 px-2 py-1 text-sm rounded-md hover:bg-gray-100 transition">
                <Filter size={14} className="mr-1" />
                Filter
              </button>

              {/* Export Button */}
              <button
                className="flex items-center bg-green-600 text-white px-2 py-1 text-sm rounded-md hover:bg-green-700 transition"
                onClick={() => setIsModalOpen(true)} // Open modal on click
              >
                <Download size={14} className="mr-1" />
                Export
              </button>
            </div>
          </div>

          {/* Table Rendering */}
          <DataTable columns={columns} data={intake} />
        </>
      )}

      {activeTab === "Warehouse" && (
        <div className="text-gray-500 mt-4">
          <p>Warehouse Overview Coming Soon...</p>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

