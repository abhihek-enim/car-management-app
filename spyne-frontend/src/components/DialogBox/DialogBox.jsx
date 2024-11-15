/* eslint-disable react/prop-types */

import "./DialogBox.css";

const DialogBox = ({ showDialog, handleClose, message, handleConfirm }) => {
  if (!showDialog) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Confirm</h3>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-footer">
          <button onClick={handleClose} className="no-btn">
            No
          </button>
          <button onClick={handleConfirm} className="yes-btn">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
