import { Asset_Fields } from "../constants";
import TextInput from "./TextInput";

const Assets = ({
  register,
  getValues,
  setValue,
  totalAssets,
  setTotalAssets,
}) => {


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
    <div className="row align-items-center justify-content-center mx-3 ">
      {Asset_Fields.map((row, index) => {
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
              className="rupee-input"
            />
          </div>
        );
      })}

      <div className="my-1 d-flex align-items-center ">
        <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
          Shares (Val)
        </p>
        <p className="mx-3 mb-0">:</p>

        <TextInput
          register={register}
          field={"assetSharesVal"}
          onChange={(e) => handleInputChange(e, "assetSharesVal")}
          placeholder={"Shares (Val)"}
        />
      </div>
      <div className="my-1 d-flex align-items-center">
        <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
          Mutual Funds (Val)
        </p>
        <p className="mx-3 mb-0">:</p>

        <TextInput
          register={register}
          field={"assetMFVal"}
          onChange={(e) => handleInputChange(e, "assetMFVal")}
          placeholder={"Mutual Funds (Val)"}
        />
      </div>

      <div className="mt-2 row align-items-start text-start justify-content-start bg-secondary position-sticky bottom-0 rounded">
        <div className="my-2 d-flex align-items-center fw-bold">
          <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
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
