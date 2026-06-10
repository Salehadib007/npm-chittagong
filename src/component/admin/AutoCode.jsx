import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api";
import QRImage from "./QRImage";
import { formatDate } from "../../../utils/formatDate";

const AutoQRCode = () => {
  const location = useLocation();

  const selections = useMemo(
    () =>
      (location.state?.ids || []).filter((item) => item?.id && item?.serial),
    [location.state],
  );

  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (!selections.length) {
      setLoading(false);
      setEnrollments([]);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const ids = selections.map((s) => s.id);
        const res = await api.get(`/enrollment/bulk/${ids.join(",")}`);

        if (!isMounted) return;

        const mapped = res.data.map((enrollment) => {
          const found = selections.find((s) => s.id === enrollment._id);
          return {
            ...enrollment,
            serial: found?.serial || "",
          };
        });

        setEnrollments([...mapped].reverse());
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selections]);

  if (!selections.length) {
    return <p>No IDs provided</p>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <style>
        {`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .print-card {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}
      </style>

      <div className="max-w-xl mx-auto">
        <div className="print-card bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-8 text-center">
            <h1 className="text-white text-xl md:text-2xl font-bold tracking-wide">
              Vehicle Pass Information
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Official Enrollment Record
            </p>
          </div>

          {/* Profile */}
          <div className="flex justify-center -mt-14">
            <img
              src={item.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            <div className="space-y-1">
              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Serial</span>
                <span className="font-bold text-right">
                  {item.enrollmentId}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">
                  Name & Rank
                </span>
                <span className="font-bold text-right">
                  {item.officialRank} {item.fullName}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">O No</span>
                <span className="font-bold text-right">{item.pno}</span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Tax</span>
                <span className="font-bold text-right">
                  {formatDate(item.taxToken)}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Reg No</span>
                <span className="font-bold text-right">
                  {item.registrationNo}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Issue</span>
                <span className="font-bold text-right">
                  {formatDate(item.issueDate)}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Fitness</span>
                <span className="font-bold text-right">
                  {formatDate(item.fitness)}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Validity</span>
                <span className="font-bold text-right text-green-700">
                  {formatDate(item.validity)}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-3">
                <span className="font-semibold text-slate-600">Mobile</span>
                <span className="font-bold text-right">
                  {item.primaryMobile}
                </span>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => {
                const text = `
Serial: ${item.enrollmentId}
Name and Rank: ${item.officialRank} ${item.fullName}
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
              className="no-print w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 rounded-2xl shadow-md transition-all duration-200"
            >
              Copy Information
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="no-print w-full mt-3 bg-slate-800 hover:bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold text-lg py-4 rounded-2xl shadow-md transition-all duration-200"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoQRCode;
