"use client";

import { useState, useEffect } from "react";
import { getDispatch } from "@/lib/actions/dispatch.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DeviceUptimeChart } from "@/components/deviceUptimeChart";
import { ConditionChart } from "@/components/conditionChart";
import ExportModal from "@/components/ExportModal";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Inventory");
  const [intake, setIntake] = useState([]);
//  const [summaryDetails, setSummaryDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate state for each filter
  const [activeFilter, setActiveFilter] = useState("Active");
  const [receiptFilter, setReceiptFilter] = useState("");
  const [holderFilter, setHolderFilter] = useState("");
  const [commodityFilter, setCommodityFilter] = useState("");
  
  // Fetch dispatch data
  useEffect(() => {
    async function fetchDispatchData() {
      try {
        const data = await getDispatch();
        setIntake(data);
      } catch (error) {
        console.error("Error fetching dispatch data:", error);
      }
    }
    fetchDispatchData();
  }, []);

  // Fetch summary details data
  useEffect(() => {
    async function fetchSummaryDetails() {
      try {
        const data = await getDispatch();
        setIntake(data);
      } catch (error) {
        console.error("Error fetching summary details:", error);
      }
    }
    fetchSummaryDetails();
  }, []);

  // Function to clean the data before passing it to the client component
  //const cleanSummaryDetails = (summaryDetails: any) => {
    // Remove or serialize any non-serializable fields
   // if (summaryDetails._id && summaryDetails._id.buffer) {
    //  summaryDetails._id = summaryDetails._id.buffer.toString('hex'); // Convert buffer to string
   // }

    // You can apply similar logic for other fields if needed
  //  return summaryDetails;
 // };

  return (
    <section className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Tabs Section */}
        <div className="flex flex-wrap border-b border-gray-300 space-x-6 mb-4">
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

        {activeTab === "Inventory" && (
          <>
            {/* State Filter Section */}
            <div className="flex flex-wrap items-center space-x-4 mb-4">
              <span className="text-sm font-medium text-gray-700">State</span>
              <div className="flex flex-wrap space-x-4">
                {/* Active Field with Dropdown */}
                <div>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm bg-white border-gray-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Not Active">Not Active</option>
                  </select>
                </div>

                {/* Input Fields */}
                {[receiptFilter, holderFilter, commodityFilter].map(
                  (filter, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder={`Enter ${
                          ["receipt", "holder", "commodity"][index]
                        }`}
                        value={filter}
                        onChange={(e) => {
                          const setFilters = [
                            setReceiptFilter,
                            setHolderFilter,
                            setCommodityFilter,
                          ];
                          setFilters[index](e.target.value);
                        }}
                        className="px-3 py-1 border rounded-md text-sm border-gray-300"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap space-x-2">
                <button className="flex items-center bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition">
                  Search
                </button>
                <button
                  onClick={() => {
                    setActiveFilter("Active");
                    setReceiptFilter("");
                    setHolderFilter("");
                    setCommodityFilter("");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>

            
            {/* Table Rendering */}
            <DataTable columns={columns} data={intake} />
          </>
        )}

        {activeTab === "Warehouse" && (
          <div>
            <h2 className="text-sm text-gray-700 mb-4">Warehouse Overview</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <DeviceUptimeChart />
              </div>
              <div>
                <ConditionChart />
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        <ExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  );
}
