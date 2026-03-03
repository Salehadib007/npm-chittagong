import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRImage = ({ value }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: 300,
      margin: 0, // ← ZERO margin, no whitespace border
      errorCorrectionLevel: "L",
    })
      .then((url) => setSrc(url))
      .catch((err) => console.error(err));
  }, [value]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="QR"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        margin: 0,
        padding: 0,
      }}
    />
  );
};

export default QRImage;
