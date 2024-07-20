import React from "react";
import "./QRCodePopup.css";

interface QRCodePopupProps {
  qrCodeData: string;
  onClose: () => void;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ qrCodeData, onClose }) => {
  return (
    <div className="qr-code-popup">
      <div className="qr-code-popup-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        {qrCodeData ? (
          <img src={qrCodeData} alt="QR Code" />
        ) : (
          <img src="/assets/images/evolution-logo.png" alt="Carregando..." />
        )}
      </div>
    </div>
  );
};

export default QRCodePopup;
