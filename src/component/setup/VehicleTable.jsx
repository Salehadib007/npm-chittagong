import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehicleTable({ items }) {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Merge both sources
  const stateVehicles = location.state || [];
  const propVehicles = items || [];
  const vehicles = [...stateVehicles, ...propVehicles];

  // ✅ Filter logic
  const filtered = vehicles.filter((v) =>
    `${v.vehicleType} ${v.vehicleBrand} ${v.registrationNo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Example navigation handler (keep if needed)
  const showData = (vehicle) => {
    navigate("/vehicle-details", { state: vehicle });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow print:shadow-none">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center print:hidden">
          <h2 className="text-lg font-semibold">Vehicle List</h2>

          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-md text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Print Title */}
        <div className="hidden print:block text-center py-4">
          <h1 className="text-xl font-bold">Active Vehicle Report</h1>
          <p className="text-sm">
            Printed on: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-slate-800 text-white print:bg-gray-200 print:text-black">
              <tr>
                <th className="px-4 py-3 text-left border">Type</th>
                <th className="px-4 py-3 text-left border">Brand</th>
                <th className="px-4 py-3 text-left border">Registration No</th>
                <th className="px-4 py-3 text-left border">Chassis</th>
                <th className="px-4 py-3 text-left border">Engine</th>
                <th className="px-4 py-3 text-left border">Tax Token</th>
                <th className="px-4 py-3 text-left border">Validity</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filtered.map((v, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50 print:hover:bg-white cursor-pointer"
                    onClick={() => showData(v)}
                  >
                    <td className="px-4 py-3 border">{v.vehicleType}</td>
                    <td className="px-4 py-3 border">{v.vehicleBrand}</td>
                    <td className="px-4 py-3 border">{v.registrationNo}</td>
                    <td className="px-4 py-3 border">{v.chassisNumber}</td>
                    <td className="px-4 py-3 border">{v.engineNumber}</td>
                    <td className="px-4 py-3 border">{v.taxToken}</td>
                    <td className="px-4 py-3 border">{v.validity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
