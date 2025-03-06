import React from "react";

const Button = ({ text, onClick, isLoading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="btn w-100 py-2 fw-semibold d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#008000", color: "white" }}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
