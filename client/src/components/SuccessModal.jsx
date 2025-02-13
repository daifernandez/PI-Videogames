import React from 'react';
import './Styles/SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message, buttonText }) => {
  return (
    <div className={`success-modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="success-modal">
        <div className="success-icon"></div>
        <div className="success-content">
          <h2 className="success-title">{title}</h2>
          <p className="success-message">{message}</p>
          <button className="success-button" onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 
