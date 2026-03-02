import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api";
import QRImage from "./QRImage";
import { formatDate } from "../../../utils/formatDate";

const AutoQRCode = () => {
  const location = useLocation();
  const ids = location.state?.ids || [];

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (ids.length === 0) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/enrollment/${ids.join(",")}`);
        setEnrollments(res.data.reverse());
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ids]);

  if (ids.length === 0) return <p>No IDs provided</p>;

  return (
    <div className="qr-wrapper">
      {loading ? (
        <div className="loading-container">
          <p>Generating QR Codes...</p>
          <div className="loader" />
        </div>
      ) : (
        <div className="qr-grid">
          {enrollments.map((item) => {
            const formattedString = [
              `Serial: ${item.pno || ""}`,
              `Name: ${item.fullName || ""}`,
              `Rank: ${item.officialRank || ""}`,
              `BR/ID No: ${item.brNoOrNid || ""}`,
              `Tax: ${formatDate(item.taxToken)}`,
              `Reg No: ${item.registrationNo || ""}`,
              `Issue: ${formatDate(item.issueDate)}`,
              `Fitness: ${formatDate(item.fitness)}`,
              `Validity: ${formatDate(item.validity)}`,
              `Mobile: ${item.primaryMobile || item.alternativeMobile || ""}`,
            ].join("\n");

            return (
              <div key={item._id} className="qr-card">
                <div className="qr-top">
                  <div className="qr-image">
                    <QRImage value={formattedString} />
                  </div>
                  <div className="qr-serial">{item.enrollmentId}</div>
                </div>
                <div className="qr-bottom">
                  <div className="qr-row">
                    <b>REG NO: </b>
                    {item.registrationNo}
                  </div>
                  <div className="qr-row">
                    <b>ISSUE DATE:</b>
                    {formatDate(item.issueDate)}
                  </div>
                  <div className="qr-row">
                    <b>VALIDITY: </b>
                    {formatDate(item.validity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="print-hide"
        style={{ marginTop: 16, textAlign: "center" }}
      >
        <button className="print-btn" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        body { margin: 0; font-family: Arial, sans-serif; background: #e8e8e8; }

        .qr-wrapper { padding: 20px; }

        .loading-container { margin-top: 40px; text-align: center; }
        .loader {
          width: 48px; height: 48px; margin: 12px auto 0;
          border: 5px solid #ddd; border-top-color: #444;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── 4 columns on screen ── */
        .qr-grid {
          display: grid;
          grid-template-columns: repeat(5, 200px);
          gap: 8px;
          justify-content: center;
        }

        /* ── Card ── */
        .qr-card {
          width: 200px;
          border: 3.5px solid #000;
          background: #fff;
        }

        /* ── Top: QR left | Serial right ── */
        .qr-top { display: flex; height: 80px; }

        .qr-image {
          flex: 0 0 80px;
          display: flex;
          width: 85px;
          height: 80px;
          border-right: 3.5px solid #000;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          line-height: 0;
          font-size: 0;
        }
        /* Force QR to fill the box with zero whitespace */
        .qr-image img {
          width: 76px !important;
          height: 76px !important;
          max-width: none !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .qr-serial {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          color: #000;
        }

        /* ── Bottom ── */
        .qr-bottom {
          border-top: 3.5px solid #000;
          padding: 3px 5px 3px;
        }
        .qr-row {
          font-size: 12px;
          font-family: Arial, sans-serif;
          color: #000;
          line-height: 1.1;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .print-btn {
          padding: 9px 22px;
          border: 2px solid #000;
          background: #fff;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        .print-btn:hover { background: #000; color: #fff; }

        /* ── Print: same as screen ── */
        @media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  body * {
    visibility: hidden !important;
  }

  .qr-wrapper, .qr-wrapper * {
    visibility: visible !important;
  }

  .qr-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0mm;
  }

  .print-hide {
    display: none !important;
  }

  /* Perfect 4 per row for A4 */
  .qr-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 47mm) !important;
    gap: 3mm !important;
    justify-content: center !important;
  }

  .qr-card {
    width: 48mm !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  @page {
    size: A4 portrait;
    margin: 5mm;
  }
}
      `}</style>
    </div>
  );
};

export default AutoQRCode;
