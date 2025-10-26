import TextInput from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCopy,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import { useLongPress } from "@custom-react-hooks/use-long-press";
import { EXPENSE_TYPES } from "../constants";
import { useEffect, useRef } from "react";

const Expenses = ({
  totalExpenses,
  setTotalExpenses,
  expensesFields,
  setExpensesFields,
  toast,
}) => {
  // Create refs for each TextInput field
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Only Take 0-9 Inputs

    e.target.value = e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add , separations
    expensesFields[index].value = e.target.value;
    setExpensesFields([...expensesFields]);
  };

  useEffect(() => {
    setTotalExpenses(
      expensesFields.reduce(
        (accumulator, currentValue) =>
          accumulator + +currentValue.value?.split(",")?.join(""),
        0
      )
    );
  }, [expensesFields]);

  const handleDelete = (index) => {
    if (window.confirm("Do you want to Delete?")) {
      // expensesFields.splice(index, 1);
      // setExpensesFields([...expensesFields]);
      setExpensesFields(expensesFields.filter((_, i) => i !== index));
    }
  };

  const handleExpenseImport = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (JSON.parse(text)?.length) {
          setExpensesFields(JSON.parse(text));
          toast.success("Data Imported from Clipboard");
        } else {
          toast.error("Invalid Data Format in Clipboard");
        }
      })
      .catch((err) => {
        toast.error("Failed to read clipboard: ", err);
      });
  };

  const handleExpenseCopy = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(expensesFields));
    } catch (error) {
      toast.error("Error Copying the Data");
      return;
    }
    toast.success("Data Copied to Clipboard");
  };

  const handleExpenseAdd = () => {
    setExpensesFields((prev) => [
      {
        label: EXPENSE_TYPES[0],
        value: "",
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="mx-3">
      <div className="row align-items-center justify-content-center">
        <div
          className="d-flex justify-content-around align-items-center mb-4 position-sticky top-0 pt-3 pb-2"
          style={{ zIndex: "1", backgroundColor: "#1e1e1e" }}
        >
          <div>
            <button
              type="button"
              className="btn btn-light rounded-circle"
              onClick={handleExpenseImport}
            >
              <FontAwesomeIcon icon={faFileImport} />
            </button>
            <label style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}>
              Import
            </label>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-light rounded-circle"
              onClick={handleExpenseCopy}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <label style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}>
              Copy
            </label>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-light rounded-circle"
              onClick={handleExpenseAdd}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <label style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}>
              Add
            </label>
          </div>
        </div>
        {expensesFields?.map((row, index) => {
          // const longPressEvents = useLongPress(() => handleDelete(index), {
          //   threshold: 500,
          //   onStart: () => console.log("Press started"),
          //   onFinish: () => console.log("Long press finished"),
          //   onCancel: () => console.log("Press cancelled"),
          // });
          return (
            <div
              className="my-1 d-flex align-items-center"
              key={index}
              // {...longPressEvents}
            >
              {expensesFields[index]?.label !== "Other" &&
              EXPENSE_TYPES.includes(expensesFields[index]?.label) ? (
                <select
                  value={expensesFields[index]?.label}
                  className="mx-2 col-md-4"
                  onChange={(e) => {
                    row.label = e.target.value;
                    setExpensesFields([...expensesFields]);

                    // Automatically focus the corresponding TextInput
                    setTimeout(() => {
                      requestAnimationFrame(() => {
                        const inputElement = inputRefs.current[index];
                        if (inputElement) {
                          inputElement.focus();
                        }
                      });
                    }, 250);
                  }}
                >
                  {EXPENSE_TYPES.map((name, index1) => (
                    <option key={index1} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  style={{
                    width: "160px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    backgroundColor: "#333",
                    color: "#fff",
                  }}
                  onBlur={(e) => {
                    row.label = e.target.value;
                    setExpensesFields([...expensesFields]);
                  }}
                  defaultValue={expensesFields[index]?.label}
                ></input>
              )}
              <label className="mx-2 col-md-1">:</label>
              <TextInput
                ref={(el) => (inputRefs.current[index] = el)} // store ref
                onChange={(e) => handleInputChange(e, index)}
                onClick={(e) => {
                  if (e.target.value === "0") e.target.value = "";
                }}
                placeholder={row.label}
                value={row.value}
              />
              {/* <button type="button" onClick={() => handleDelete(index)}>
                X
              </button> */}
              <span className="date-Span">
                {expensesFields[index]?.timestamp
                  ? new Date(
                      expensesFields[index]?.timestamp
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          );
        })}
        <div className="mt-2 row align-items-start text-start justify-content-start bg-danger position-sticky bottom-0 rounded">
          <div className="my-2 d-flex align-items-center ">
            <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
              Total Expenses
            </p>
            <p className="mx-3 mb-0">:</p>
            <TextInput
              value={JSON.stringify(totalExpenses).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
              disabled
              placeholder="Total"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
