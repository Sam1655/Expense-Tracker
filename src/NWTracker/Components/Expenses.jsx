import TextInput from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCopy,
  faFileImport,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { EXPENSE_TYPES } from "../constants";
import { useEffect, useRef } from "react";

const Expenses = ({
  totalExpenses,
  setTotalExpenses,
  expensesFields,
  setExpensesFields,
  toast,
  setModal,
}) => {
  const inputAmountRefs = useRef([]); //For Amount TextInput
  const inputRefs = useRef([]); // For Label="Other" input
  console.log(expensesFields, "expensesFields");

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

  const handleExpenseAdd = () => {
    setModal({ isOpen: true });
  };

  return (
    <div className="mx-3 responsive-expense-container">
      <div className="row align-items-center justify-content-center mt-2">
        {expensesFields?.map((row, index) => {
          return (
            <div
              className="my-1 d-flex align-items-center justify-content-center"
              key={index}
            >
              <span
                type="button"
                className="mx-2 "
                onClick={() => {
                  setModal({ isOpen: true, index: index });
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
              {expensesFields[index]?.label !== "Other" &&
              EXPENSE_TYPES.includes(expensesFields[index]?.label) ? (
                <select
                  value={expensesFields[index]?.label}
                  className="mx-2"
                  onChange={(e) => {
                    row.label = e.target.value;
                    setExpensesFields([...expensesFields]);

                    // Automatically focus the corresponding TextInput
                    requestAnimationFrame(() => {
                      const inputElement =
                        e.target.value === "Other"
                          ? inputRefs.current[index]
                          : inputAmountRefs.current[index];
                      if (inputElement) {
                        inputElement.focus();
                      }
                    });
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
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  className="mx-2 expenseInput"
                  onChange={(e) => {
                    row.label = e.target.value;
                    setExpensesFields([...expensesFields]);
                  }}
                  onClick={(e) => {
                    if (e.target.value === "Other") e.target.value = "";
                  }}
                  value={expensesFields[index]?.label}
                ></input>
              )}
              <label className="mx-2">:</label>
              <TextInput
                ref={(el) => (inputAmountRefs.current[index] = el)} // store ref
                onChange={(e) => handleInputChange(e, index)}
                onClick={(e) => {
                  if (e.target.value === "0") e.target.value = "";
                }}
                placeholder={row.label}
                value={row.value}
              />
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
            <div>
              <button
                type="button"
                className="btn btn-light rounded-circle"
                onClick={handleExpenseAdd}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
