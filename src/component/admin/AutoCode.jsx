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
    <div className="qr-wrapper">
      {loading ? (
        <div className="loading-container">
          <p>Generating QR Codes...</p>
          <div className="loader" />
        </div>
      ) : (
        <div className="qr-grid">
          {enrollments.map((item) => {
            const qrLink = `https://npm-chittagong-nu.vercel.app/permit/${item._id}`;

            return (
              <div key={item._id} className="qr-card">
                <div className="qr-top">
                  <div className="qr-image">
                    <QRImage value={qrLink} />
                  </div>

                  <div className="qr-serial">{item.enrollmentId}</div>
                </div>

                <div className="qr-bottom font-black">
                  <div className="qr-row">
                    <b>REG NO: {item.registrationNo}</b>
                  </div>

                  <div className="qr-row">
                    <b>ISSUE DATE: {formatDate(item.issueDate)}</b>
                  </div>

                  <div className="qr-row">
                    <b>VALIDITY:</b>{" "}
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
        style={{
          marginTop: 16,
          textAlign: "center",
        }}
      >
        <button className="print-btn" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #e8e8e8;
        }

        .qr-wrapper {
          padding: 20px;
        }

        .loading-container {
          margin-top: 40px;
          text-align: center;
        }

        .loader {
          width: 48px;
          height: 48px;
          margin: 12px auto;
          border: 5px solid #ddd;
          border-top-color: #444;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* SCREEN */
        .qr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, 200px);
          gap: 8px;
          justify-content: center;
        }

        .qr-card {
          width: 200px;
          border: 3.5px solid #000;
          background: #fff;
        }

        .qr-top {
          display: flex;
          height: 80px;
        }

        .qr-image {
          width: 83px;
          height: 80px;
          border-right: 3.5px solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .qr-image img {
          width: 73px !important;
          height: 76px !important;
          display: block;
        }

        .qr-serial {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15px;
          font-weight: 700;
        }

        .qr-bottom {
          border-top: 3.5px solid #000;
          padding: 3px 5px;
        }

        .qr-row {
          font-size: 12px;
          line-height: 1.1;
          letter-spacing: 0.7px;
          white-space: nowrap;
        }

        .print-btn {
          padding: 9px 22px;
          border: 2px solid #000;
          background: #fff;
          font-weight: 700;
          cursor: pointer;
        }

        .print-btn:hover {
          background: #000;
          color: #fff;
        }

        /* PRINT */
@media print {

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
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

  /* 🔥 VERY SMALL PAGE MARGIN */
  @page {
    size: A4 portrait;
    margin: 2mm; /* reduced from 5mm */
  }

  /* GRID (fit more precisely) */
  .qr-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 4.3cm);
    gap: 4mm;
    justify-content: center;
  }

  /* 🔥 STRICT CARD SIZE */
  .qr-card {
    width: 4.3cm !important;
    height: 3.2cm !important;
    border: 0.8mm solid #000 !important;
    break-inside: avoid;
    page-break-inside: avoid;
    overflow: hidden;
  }

  /* TOP */
  .qr-top {
    display: flex;
    height: 1.9cm !important;
  }

  .qr-image {
    width: 1.9cm !important;
    height: 1.9cm !important;
    border-right: 0.8mm solid #000 !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .qr-image img {
    width: 1.7cm !important;
    height: 1.8cm !important;
  }

  .qr-serial {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12pt !important;
    font-weight: 900;
    text-align: center;
    padding: 0 1mm;
  }

  /* BOTTOM */
  .qr-bottom {
    height: 1.3cm !important;
    border-top: 0.8mm solid #000 !important;
    padding: 0.5mm 1mm !important;
  }

  .qr-row {
    font-size: 7.6pt !important;
    line-height: 1.2 !important;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 900;
  }

  .qr-row b,
  .qr-row strong {
    font-weight: 900;
  }
}
      `}</style>
    </div>
  );
};

export default AutoQRCode;
