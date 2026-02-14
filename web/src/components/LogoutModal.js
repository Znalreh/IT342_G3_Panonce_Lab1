import React from "react";

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Are you sure you want to logout?</h3>
        <div className="modal-actions">
          <button className="btn-danger" onClick={onConfirm}>
            Yes, Logout
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
