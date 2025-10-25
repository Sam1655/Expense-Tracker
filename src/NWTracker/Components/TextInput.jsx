import React from "react";
import "./TextInput.css";

const TextInput = ({
  register,
  field,
  control,
  onChange,
  onClick,
  value,
  defaultValue,
  disabled,
  placeholder = "Enter Amount",
}) => {
  return (
    <div className="rupee-input-container">
      <span className="rupee-symbol">₹</span>
      {field ? (
        <input
          type="text"
          inputMode="numeric"
          className="rupee-input"
          placeholder={placeholder}
          {...register(field)}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          control={control}
        />
      ) : (
        <input
          type="text"
          inputMode="numeric"
          className="rupee-input"
          placeholder="Enter amount"
          onChange={onChange}
          onClick={onClick}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          control={control}
        />
      )}
    </div>
  );
};

export default TextInput;
