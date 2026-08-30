import { useEffect } from "react";
import { Asset_Fields, Asset_Return_Fields } from "../constants";
import TextInput from "./TextInput";

import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { rc } from "../NetWorthTracker";

const hasValue = (v) => v !== undefined && v !== null && v !== "";

const Assets = ({
  register,
  getValues,
  setValue,
  totalAssets,
  setTotalAssets,
  prevMonthdata,
  setxAxisField,
}) => {
  useEffect(() => {
    setxAxisField([
      { label: "N/W (Inv)", field: "netWorth" },
      { label: "N/W with Returns", field: "netWorthRet" },
      { label: "Assets", field: "totalAssets" },
    ]);
  }, []);

  const handleInputChange = (e, field) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add , separations
    setValue(field, e.target.value);
    setTotalAssets(
      Asset_Fields.reduce(
        (accumulator, currentValue) =>
          accumulator + rc(getValues(currentValue.field)),
        0,
      ),
    );
  };

  return (
    <div className="row align-items-center justify-content-center mx-3 my-2">
      {Asset_Fields.map((row, index) => {
        const fields = row.field.split(".");
        const prevMonthValue = prevMonthdata?.[fields[0]]?.[fields[1]];
        const currentVal = getValues(row.field);

        const Chg =
          hasValue(currentVal) && hasValue(prevMonthValue)
            ? rc(currentVal) - rc(prevMonthValue)
            : null;

        return (
          <div className="my-1 d-flex align-items-center" key={index}>
            <p className="text-start mb-0" style={{ flex: "0 0 45%" }}>
              {row.label}
            </p>
            <p className="mx-3 mb-0">:</p>

            <div style={{ flex: "0 0 40%" }}>
              <TextInput
                register={register}
                field={row.field}
                onChange={(e) => handleInputChange(e, row.field)}
                placeholder={
                  hasValue(prevMonthValue) ? prevMonthValue : row.label
                }
                className="rupee-input"
                onClick={() => setxAxisField([row])}
              />
            </div>
            {Chg !== null && (
              <span
                className={`mx-1 ${Chg >= 0 ? "text-success" : "text-danger"}`}
                style={{ fontSize: "0.6rem" }}
              >
                {Chg > 0 ? "+" : ""}
                {Chg}
              </span>
            )}
          </div>
        );
      })}

      {Asset_Return_Fields.map((row, index) => {
        const val = rc(getValues(row.field));
        const inv = rc(getValues(row.field.replace("Val", "Inv")));

        const perChg = inv !== 0 ? ((val - inv) / inv) * 100 : null;

        const fields = row.field.split(".");
        const prevMonthValue = prevMonthdata?.[fields[0]]?.[fields[1]];

        return (
          <div className="my-1 d-flex align-items-center" key={index}>
            <p className="text-start mb-0" style={{ flex: "0 0 45%" }}>
              {row.label}
            </p>
            <p className="mx-3 mb-0">:</p>

            <div style={{ flex: "0 0 40%" }}>
              <TextInput
                register={register}
                field={row.field}
                onChange={(e) => handleInputChange(e, row.field)}
                placeholder={
                  hasValue(prevMonthValue) ? prevMonthValue : row.label
                }
                className="rupee-input"
                onClick={() => setxAxisField([row])}
              />
            </div>
            {perChg !== null && (
              <span
                className={`mx-1 ${perChg >= 0 ? "text-success" : "text-danger"}`}
                style={{ fontSize: "0.6rem" }}
              >
                <FontAwesomeIcon icon={perChg >= 0 ? faCaretUp : faCaretDown} />
                {Math.abs(perChg).toFixed(1)}%
              </span>
            )}
          </div>
        );
      })}

      <div className="mt-2 row align-items-start text-start justify-content-start bg-primary position-sticky bottom-0 rounded">
        <div className="my-2 d-flex align-items-center fw-bold">
          <p className="text-start mb-0" style={{ flex: "0 0 45%" }}>
            Total Assets
          </p>
          <p className="mx-3 mb-0">:</p>
          <TextInput
            value={totalAssets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            disabled
            placeholder="Total"
          />
        </div>
      </div>
    </div>
  );
};

export default Assets;
