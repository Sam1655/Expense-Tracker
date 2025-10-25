import React from "react";
import TextInput from "./TextInput";
import { LIABILITIES_FIELD } from "../constants";

const Liabilities = ({
  register,
  getValues,
  setValue,
  totalLiabilities,
  setTotalLiabilities,
}) => {


  const handleInputChange = (e, field) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Only Take 0-9 Inputs

    e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add , separations
    setValue(field, e.target.value);

    setTotalLiabilities(
      LIABILITIES_FIELD.reduce(
        (accumulator, currentValue) =>
          accumulator + +getValues(currentValue.field)?.split(",")?.join(""),
        0
      )
    );
  };
  return (
    <div className="row align-items-center justify-content-center mx-3">
      {LIABILITIES_FIELD.map((row, index) => {
        return (
          <div className="my-1 d-flex align-items-center" key={index}>
            <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
              {row.label}
            </p>
            <p className="mx-3 mb-0">:</p>

            <TextInput
              register={register}
              field={row.field}
              onChange={(e) => handleInputChange(e, row.field)}
              placeholder={row.label}
            />
          </div>
        );
      })}
      <div className="mt-2 row align-items-start text-start justify-content-start bg-secondary position-sticky bottom-0 rounded">
        <div className="my-2 d-flex align-items-center ">
          <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
            Total Liabilities
          </p>
          <p className="mx-3 mb-0">:</p>
          <TextInput
            value={JSON.stringify(totalLiabilities).replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )}
            disabled
            placeholder="Total"
          />
        </div>
      </div>
    </div>
  );
};

export default Liabilities;
