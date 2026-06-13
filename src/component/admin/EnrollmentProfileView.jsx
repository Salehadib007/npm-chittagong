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
      } catch (error) {
        console.error(error);
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

  const copyText = `
Serial No : ${item.enrollmentId}
Name & Rank : ${item.officialRank} ${item.fullName}
P.NO / O.NO : ${item.pno}
Billet : ${item.jobLocation || "-"}
Vehicle Reg No : ${item.registrationNo}
Vehicle Tax Token Validity : ${formatDate(item.taxToken)}
Vehicle Fitness Validity : ${formatDate(item.fitness)}
Sticker Issued : ${formatDate(item.issueDate)}
Sticker Validity : ${formatDate(item.validity)}
Mobile : ${item.primaryMobile}
  `.trim();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
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

      <div className="max-w-4xl mx-auto">
        <div className="print-card bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white text-center py-5">
            <h1 className="text-2xl font-bold">Confidential Information</h1>
            <p className="text-slate-300 text-sm mt-1">
              Official Information Record
            </p>
          </div>

          {/* Profile */}
          <div className="flex justify-center pt-6">
            <img
              src={item.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-5 text-lg">
              <div>
                <span className="font-bold">Serial No :</span>{" "}
                {item.enrollmentId}
              </div>

              <div>
                <span className="font-bold">Name & Rank :</span>{" "}
                {item.officialRank} {item.fullName}
              </div>

              <div>
                <span className="font-bold">P.NO / O.NO :</span> {item.pno}
              </div>

              <div>
                <span className="font-bold">Billet :</span>{" "}
                {item.jobLocation || "-"}
              </div>

              <div>
                <span className="font-bold">Vehicle Reg No :</span>{" "}
                {item.registrationNo}
              </div>

              <div>
                <span className="font-bold">Vehicle Tax Token Validity :</span>{" "}
                {formatDate(item.taxToken)}
              </div>

              <div>
                <span className="font-bold">Vehicle Fitness Validity :</span>{" "}
                {formatDate(item.fitness)}
              </div>

              <div>
                <span className="font-bold">Sticker Issued :</span>{" "}
                {formatDate(item.issueDate)}
              </div>

              <div>
                <span className="font-bold">Sticker Validity :</span>{" "}
                {formatDate(item.validity)}
              </div>

              <div>
                <span className="font-bold">Mobile :</span> {item.primaryMobile}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 space-y-3 no-print">
              <button
                onClick={() => navigator.clipboard.writeText(copyText)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Copy Information
              </button>

              <button
                onClick={() => window.print()}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
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
