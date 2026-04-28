import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PersonnelVehicleTable({ items }) {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Merge vehicles from navigation state + props
  const stateData = location.state || [];
  const propData = items || [];
  const data = [...stateData, ...propData];

  // Filter logic
  const filtered = data.filter((v) =>
    `${v.pno} ${v.fullName} ${v.officialRank} ${v.vehicleType} ${v.vehicleBrand} ${v.registrationNo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Row click handler (optional navigation)
  const handleClick = (item) => {
    navigate("/vehicle-details", { state: item });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow print:shadow-none">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center print:hidden">
          <h2 className="text-lg font-semibold">Personnel Vehicle List</h2>

          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-md text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center py-4">
          <h1 className="text-xl font-bold">Personnel Vehicle Report</h1>
          <p className="text-sm">
            Printed on: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-slate-800 text-white print:bg-gray-200 print:text-black">
              <tr>
                <th className="px-4 py-3 border text-left">PNO / Office No</th>
                <th className="px-4 py-3 border text-left">Name</th>
                <th className="px-4 py-3 border text-left">Rank</th>
                <th className="px-4 py-3 border text-left">Type</th>
                <th className="px-4 py-3 border text-left">Brand</th>
                <th className="px-4 py-3 border text-left">Registration No</th>
                <th className="px-4 py-3 border text-left">Validity</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((v, index) => (
                  <tr
                    key={index}
                    onClick={() => handleClick(v)}
                    className="border-b hover:bg-slate-50 print:hover:bg-white cursor-pointer"
                  >
                    <td className="px-4 py-3 border">{v.pno}</td>
                    <td className="px-4 py-3 border">{v.fullName}</td>
                    <td className="px-4 py-3 border">{v.officialRank}</td>
                    <td className="px-4 py-3 border">{v.vehicleType}</td>
                    <td className="px-4 py-3 border">{v.vehicleBrand}</td>
                    <td className="px-4 py-3 border">{v.registrationNo}</td>
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
