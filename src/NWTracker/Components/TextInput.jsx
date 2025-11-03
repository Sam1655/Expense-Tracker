import React, { forwardRef } from "react";
import "./TextInput.css";

const TextInput = forwardRef(
  (
    {
      register,
      field,
      control,
      onChange,
      onClick,
      value,
      defaultValue,
      disabled,
      placeholder = "Enter Amount",
    },
    ref
  ) => {
    return (
      <div className="rupee-input-container">
        <span className="rupee-symbol">₹</span>
        {field ? (
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            className="rupee-input"
            placeholder={placeholder}
            {...register(field)}
            onChange={onChange}
            onClick={onClick}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            control={control}
          />
        ) : (
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            className="rupee-input"
            placeholder={placeholder}
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
  }
);

export default TextInput;
