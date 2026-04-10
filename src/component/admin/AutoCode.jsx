import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api";
import QRImage from "./QRImage";
import { formatDate } from "../../../utils/formatDate";

const AutoQRCode = () => {
  const location = useLocation();

  const selections = location.state?.ids || [];
  // [{ id, serial }]

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  console.log(enrollments);

  useEffect(() => {
    if (selections.length === 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const ids = selections.map((s) => s?.id);

        const res = await api.get(`/enrollment/${ids.join(",")}`);

        // attach serials to returned enrollments
        const mapped = res.data.map((enrollment) => {
          const found = selections.find((s) => s.id === enrollment._id);

          return {
            ...enrollment,
            serial: found?.serial || null,
          };
        });

        setEnrollments(mapped.reverse());
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selections]);

  if (selections.length === 0) return <p>No IDs provided</p>;

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
              `Serial: ${item.serial || ""}/${new Date(item.createdAt).getFullYear().toString().slice(-2) || ""}`,
              `Name and Rank: ${item.officialRank || ""} ${item.fullName || ""}`,
              `PNO No: ${item.pno || ""}`,
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
                  <div className="qr-serial">{`${item.serial}/${new Date(item.createdAt).getFullYear().toString().slice(-2)}`}</div>
                </div>
                <div className="qr-bottom">
                  <div className="qr-row">
                    <b>REG NO: </b>
                    {item.registrationNo}
                  </div>
                  <div className="qr-row">
                    <b>ISSUE DATE: </b>
                    {formatDate(item.issueDate)}
                  </div>
                  <div className="qr-row">
                    <b>VALIDITY: </b>
                    <strong>{formatDate(item.validity)}</strong>
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
          width: 83px;
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
          width: 73px !important;
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
          font-size: 15px;
          font-weight: 700;
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

  .qr-wrapper,
  .qr-wrapper * {
    visibility: visible !important;
  }

  .qr-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
  }

  .print-hide {
    display: none !important;
  }

  /* ===== A4 Page ===== */
  @page {
    size: A4 portrait;
    margin: 5mm;

  }

  /* ===== Layout: 4 per row ===== */
  .qr-grid {
    display: flex !important;
    flex-wrap: wrap;
    gap: 3mm;
    justify-content: center;
  }

  /* ===== CARD SIZE ===== */
  .qr-card {
    width: 4.2cm !important;
    height: 3cm !important;
    border: 1mm solid #000 !important;
    box-sizing: border-box;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* ===== TOP SECTION (2cm height) ===== */
  .qr-top {
    display: flex;
    height: 1.9cm !important;
  }

  /* ===== QR IMAGE 2cm × 2cm ===== */
  .qr-image {
    width: 1.8cm !important;
    height: 1.9cm !important;
    border-right: 1mm solid #000 !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .qr-image img {
    width: 1.9cm !important;
    height: 1.82cm !important;
  }

  /* ===== SERIAL 2.4cm × 2cm ===== */
  .qr-serial {
    width: 2.4cm !important;
    height: 1.8cm !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt !important;
    font-weight: 700;
  }

  /* ===== BOTTOM SECTION (Remaining 1.2cm) ===== */
  .qr-bottom {
    height: 1.2cm !important;
    border-top: 1mm solid #000 !important;
    padding: 0.5mm 2mm !important;
  }

  .qr-row {
    font-size: 6.7pt !important;
    line-height: 1.1 !important;
    letter-spacing: 1.6px;
    white-space: nowrap;
    margin-left: -1mm !important

  }

}
      `}</style>
    </div>
  );
};

export default AutoQRCode;
