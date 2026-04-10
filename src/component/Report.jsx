import React, { useEffect, useState } from "react";
// import VehicleTable from "./setup/VehicleTable";
import api from "../../utils/api";
import PersonnelVehicleTable from "./setup/PersonnelVehicleTable";

const Report = () => {
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollment");
      const data = res.data.filter(
        (item) =>
          !isExpired(item.validity) &&
          !isExpired(item.fitness) &&
          !isExpired(item.sticker) &&
          !isExpired(item.licenseExpireDate),
      );
      setEnrollments(data);
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    }
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ✅ Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between px-8 bg-slate-100 pt-4 items-center pb-4 print:hidden">
        <h1 className="text-2xl font-bold">Active Vehicle Report</h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Print
        </button>
      </div>

      <PersonnelVehicleTable items={enrollments} />
    </div>
  );
};

export default Report;
