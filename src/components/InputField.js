import React from "react";

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control p-3 border border-secondary rounded"
      />
    </div>
  );
};

export default InputField;
