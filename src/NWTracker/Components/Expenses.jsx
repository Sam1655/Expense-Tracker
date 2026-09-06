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
        0,
      ),
    );
  }, [expensesFields]);

  const handleExpenseAdd = () => {
    setModal({ isOpen: true });
  };

  const expensesByDate = expensesFields.reduce((groups, expense, index) => {
    const dateKey = expense.timestamp
      ? new Date(expense.timestamp).toLocaleDateString("en-CA")
      : "undated";

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({ expense, index });
    return groups;
  }, {});

  const sortedExpensesByDate = Object.entries(expensesByDate).sort(
    ([firstDate], [secondDate]) => {
      if (firstDate === "undated") return 1;
      if (secondDate === "undated") return -1;
      return secondDate.localeCompare(firstDate);
    },
  );

  const formatDateHeading = (dateKey) => {
    if (dateKey === "undated") return "Date not set";

    return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="responsive-expense-container">
      <div className="expense-list m-3">
        {sortedExpensesByDate.map(([dateKey, expenses]) => (
          <section className="expense-date-group" key={dateKey}>
            <div className="expense-date-header">
              {formatDateHeading(dateKey)}
            </div>
            {expenses.map(({ expense: row, index }) => (
              <div
                className="my-1 px-4 d-flex align-items-center justify-content-center expense-row"
                key={index}
              >
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
                <span
                  type="button"
                  className="mx-2"
                  onClick={() => {
                    setModal({ isOpen: true, index: index });
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </span>
              </div>
            ))}
          </section>
        ))}
        <div className="mt-2 row align-items-start text-start justify-content-start bg-danger position-sticky bottom-0 rounded">
          <div className="my-2 d-flex align-items-center ">
            <p className="text-start mb-0" style={{ flex: "0 0 40%" }}>
              Total Expenses
            </p>
            <p className="mx-3 mb-0">:</p>
            <TextInput
              value={JSON.stringify(totalExpenses).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ",",
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
