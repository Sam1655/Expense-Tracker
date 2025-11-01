import { Asset_Fields, Asset_Return_Fields } from "../constants";
import TextInput from "./TextInput";

const Assets = ({
  register,
  getValues,
  setValue,
  totalAssets,
  setTotalAssets,
  prevMonthdata,
}) => {
  const rc = (str) => str?.split(",")?.join(""); // Remove Comma

  const handleInputChange = (e, field) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add , separations
    setValue(field, e.target.value);
    setTotalAssets(
      Asset_Fields.reduce(
        (accumulator, currentValue) =>
          accumulator + +getValues(currentValue.field)?.split(",")?.join(""),
        0
      )
    );
  };
  return (
    <div className="row align-items-center justify-content-center mx-3 my-2">
      {Asset_Fields.map((row, index) => {
        const fields = row.field.split(".");
        const prevMonthValue = prevMonthdata?.[fields[0]]?.[fields[1]];
        const currentVal = getValues(row.field);

        const perChg =
          currentVal && prevMonthValue
            ? (
                ((rc(currentVal) - rc(prevMonthValue)) / rc(prevMonthValue)) *
                100
              ).toFixed(2)
            : "";
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
                placeholder={prevMonthValue || row.label}
                className="rupee-input"
              />
            </div>
            {perChg && (
              <span
                className={`mx-1 ${
                  perChg > 0 ? "text-success" : "text-danger"
                }`}
                style={{ fontSize: "0.6rem" }}
              >
                {/* {perChg > 0 ? "↑" : "↓"} */}
                {perChg}%
              </span>
            )}
          </div>
        );
      })}
      {Asset_Return_Fields.map((row, index) => {
        const fields = row.field.split(".");
        const prevMonthValue = prevMonthdata?.[fields[0]]?.[fields[1]];
        const currentVal = getValues(row.field);

        const perChg =
          currentVal && prevMonthValue
            ? (
                ((rc(currentVal) - rc(prevMonthValue)) / rc(prevMonthValue)) *
                100
              ).toFixed(2)
            : "";
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
                placeholder={prevMonthValue || row.label}
                className="rupee-input"
              />
            </div>
            {perChg && (
              <span
                className={`mx-1 ${
                  perChg > 0 ? "text-success" : "text-danger"
                }`}
                style={{ fontSize: "0.6rem" }}
              >
                {/* {perChg > 0 ? "↑" : "↓"} */}
                {perChg}%
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
            value={JSON.stringify(totalAssets).replace(
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

export default Assets;
