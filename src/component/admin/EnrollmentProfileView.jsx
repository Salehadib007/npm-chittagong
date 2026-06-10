import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { formatDate } from "../../../utils/formatDate";

const EnrollmentProfileView = () => {
  const { enrollmentId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await api.get(`/enrollment/${enrollmentId}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [enrollmentId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-semibold">
        Enrollment not found
      </div>
    );
  }

  const fields = [
    ["Serial", item.enrollmentId],
    ["Name & Rank", `${item.officialRank} ${item.fullName}`],
    ["O No", item.pno],
    ["Tax", formatDate(item.taxToken)],
    ["Reg No", item.registrationNo],
    ["Issue Date", formatDate(item.issueDate)],
    ["Fitness", formatDate(item.fitness)],
    ["Validity", formatDate(item.validity)],
    ["Mobile", item.primaryMobile],
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* PRINT STYLE */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .card { box-shadow: none !important; border: none !important; }
          }
        `}
      </style>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* CARD */}
        <div className="card bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-6 text-center">
            <h1 className="text-white text-xl font-bold tracking-wide">
              Vehicle Pass Information
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Official Enrollment Record
            </p>
          </div>

          {/* PROFILE */}
          <div className="flex justify-center -mt-12">
            <img
              src={item.profileImage}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-8">
            {/* INFO GRID */}
            <div className="divide-y divide-slate-200">
              {fields.map(([label, value], i) => (
                <div key={i} className="flex justify-between gap-6 py-3">
                  <span className="text-slate-500 font-medium">{label}</span>

                  <span className="text-slate-900 font-semibold text-right break-words">
                    {value || "-"}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-8 space-y-3 no-print">
              <button
                onClick={() => {
                  const text = `
Serial: ${item.enrollmentId}
Name & Rank: ${item.officialRank} ${item.fullName}
O No: ${item.pno}
Tax: ${formatDate(item.taxToken)}
Reg No: ${item.registrationNo}
Issue: ${formatDate(item.issueDate)}
Fitness: ${formatDate(item.fitness)}
Validity: ${formatDate(item.validity)}
Mobile: ${item.primaryMobile}
                  `.trim();

                  navigator.clipboard.writeText(text);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition"
              >
                Copy Information
              </button>

              <button
                onClick={() => window.print()}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow transition"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentProfileView;
