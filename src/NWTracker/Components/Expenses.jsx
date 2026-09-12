import TextInput from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCopy,
  faFileImport,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { EXPENSE_TYPES } from "../constants";
import { useEffect, useMemo, useRef, useState } from "react";

const parseAmount = (value) =>
  Number(String(value ?? "").replace(/,/g, "")) || 0;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

const formatDisplayDate = (timestamp) => {
  if (!timestamp) return "Date not set";

  const parsedDate = new Date(timestamp);
  if (Number.isNaN(parsedDate.getTime())) return "Date not set";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Expenses = ({
  totalExpenses,
  setTotalExpenses,
  expensesFields,
  setExpensesFields,
  toast,
  setModal,
  selectedDate,
  consolidatedData,
}) => {
  const inputAmountRefs = useRef([]); //For Amount TextInput
  const inputRefs = useRef([]); // For Label="Other" input
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [searchAllMonths, setSearchAllMonths] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchText]);

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
  const matchingExpenses = useMemo(() => {
    const monthEntries = searchAllMonths
      ? Object.entries(consolidatedData ?? {}).flatMap(
          ([monthKey, monthData]) =>
            (monthData?.expensesFields ?? []).map((expense, index) => ({
              ...expense,
              monthKey,
              index,
            })),
        )
      : (expensesFields ?? []).map((expense, index) => ({
          ...expense,
          monthKey: selectedDate,
          index,
        }));

    const queryWords = debouncedSearchText
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (!queryWords.length) return [];

    const uniqueEntries = new Map();

    monthEntries.forEach((expense) => {
      const label = String(expense.label ?? "").toLowerCase();
      const description = String(expense.desc ?? "").toLowerCase();
      const haystack = `${label} ${description}`;
      const matchesAnyWord = queryWords.some((word) => haystack.includes(word));

      if (!matchesAnyWord) return;

      const dedupeKey = `${expense.monthKey ?? selectedDate ?? "current"}-${expense.index ?? expense.timestamp ?? `${label}-${description}`}`;
      if (!uniqueEntries.has(dedupeKey)) {
        uniqueEntries.set(dedupeKey, expense);
      }
    });

    return [...uniqueEntries.values()];
  }, [
    consolidatedData,
    debouncedSearchText,
    expensesFields,
    searchAllMonths,
    selectedDate,
  ]);

  const totalListedExpenses = matchingExpenses.reduce(
    (sum, expense) => sum + parseAmount(expense.value),
    0,
  );
  console.log(matchingExpenses, "matchingExpenses");

  return (
    <div className="responsive-expense-container">
      <div className="expense-list m-3">
        <div className="expense-search-panel">
          <div className="expense-search-input-wrap">
            <input
              type="text"
              className="expense-search-input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder={
                searchAllMonths
                  ? "Search All Expenses"
                  : "Search Current Month Expenses"
              }
            />
            {searchText && (
              <button
                type="button"
                className="expense-search-clear"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <label className="expense-search-toggle">
            {/* <span>{searchAllMonths ? "All Data" : "Current Month"}</span> */}
            <button
              type="button"
              className={`search-toggle-switch ${searchAllMonths ? "active" : ""}`}
              onClick={() => setSearchAllMonths((prev) => !prev)}
              aria-label="Toggle all-month search"
              aria-pressed={searchAllMonths}
            >
              <span className="toggle-knob" />
            </button>
          </label>
        </div>

        {searchText ? (
          <div>
            <div className="expense-search-results">
              <table className="expense-search-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Desc</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {matchingExpenses.length ? (
                    matchingExpenses.map((expense, index) => (
                      <tr
                        key={`${expense.monthKey || selectedDate || "current"}-${expense.index ?? index}`}
                      >
                        <td>{expense.label || "N/A"}</td>
                        <td>{expense.desc || "-"}</td>
                        <td>₹ {formatCurrency(parseAmount(expense.value))}</td>
                        <td>{formatDisplayDate(expense.timestamp)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center ">
                        No matching expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="expense-search-total">
              Total Listed Amount:{" "}
              <strong>₹ {formatCurrency(totalListedExpenses)}</strong>
            </div>
          </div>
        ) : (
          <div>
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
        )}
      </div>
    </div>
  );
};

export default Expenses;
