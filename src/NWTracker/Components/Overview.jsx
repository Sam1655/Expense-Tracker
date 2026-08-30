import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { rc } from "../NetWorthTracker";

// Guards against undefined/null values and gives Indian digit grouping (1,23,456)
const formatCurrency = (num) => {
  const n = Number(num) || 0;
  return n.toLocaleString("en-IN");
};

const Overview = ({
  consolidatedData,
  selectedDate,
  getValues,
  netWorth,
  setxAxisField,
}) => {
  const selectedMonth = selectedDate;
  const [year, month] = selectedMonth.split("-").map(Number);
  const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);

  const prevMonthdata = consolidatedData?.[prevMonth];
  const curr = consolidatedData?.[selectedDate];

  const hasPrevMonth = Boolean(prevMonthdata?.netWorth);

  // Fall back to the saved snapshot's asset/income data if the live form
  // field isn't registered yet (e.g. user hasn't opened the Assets tab this session)
  const currEPF = rc(getValues("asset.EPF") ?? curr?.asset?.EPF);
  const prevEPF = rc(prevMonthdata?.asset?.EPF);
  const epfIncome = rc(
    getValues("income.epfIncome") ?? curr?.income?.epfIncome,
  );

  const projectedExpense = hasPrevMonth
    ? (curr?.totalIncome ?? 0) +
      prevMonthdata.netWorth -
      netWorth +
      (currEPF - prevEPF - epfIncome) // EPF Int
    : null;

  const oneMonthChange = hasPrevMonth
    ? netWorth - prevMonthdata.netWorth
    : null;

  const netWorthPerChange =
    hasPrevMonth && prevMonthdata.netWorth !== 0
      ? ((netWorth - prevMonthdata.netWorth) / prevMonthdata.netWorth) * 100
      : null;

  useEffect(() => {
    setxAxisField([
      { label: "N/W (Inv)", field: "netWorth" },
      { label: "N/W with Returns", field: "netWorthRet" },
    ]);
  }, []);

  return (
    <div
      className="container px-4 py-4 rounded-3 shadow-sm text-light"
      style={{
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#1e1e1e",
      }}
    >
      <div className="mb-3 text-center">
        <p className="m-0 fs-5 fw-medium">My Networth</p>
      </div>

      {/* Main Net Worth */}
      <div className="mb-4 text-center">
        <h1 className="display-5 fw-bold mb-1">₹{formatCurrency(netWorth)}</h1>
        <p className="text-secondary">Assets − Liabilities</p>
      </div>

      {/* Assets and Liabilities */}
      <div className="row text-center mb-4">
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Assets</h6>
          <h4 className="fw-bold">₹ {formatCurrency(curr?.totalAssets)}</h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Liabilities
          </h6>
          <h4 className="fw-bold">
            ₹ {formatCurrency(curr?.totalLiabilities)}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Income</h6>
          <h4 className="fw-bold">₹ {formatCurrency(curr?.totalIncome)}</h4>
        </div>
      </div>

      <hr style={{ border: "none", height: "1px", backgroundColor: "#555" }} />

      {/* Expenses */}
      <div className="row text-center my-4">
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Projected Expenses
          </h6>
          <h4 className="fw-bold">
            {projectedExpense === null
              ? "—"
              : `₹ ${formatCurrency(projectedExpense)}`}
          </h4>
        </div>
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Actual Expenses
          </h6>
          <h4 className="fw-bold">₹ {formatCurrency(curr?.totalExpenses)}</h4>
        </div>
      </div>

      <hr style={{ border: "none", height: "1px", backgroundColor: "#555" }} />

      {/* 1 Month Change */}
      <div className="row text-center my-4">
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            1 Month Change
          </h6>
          <h4
            className={`fw-bold ${
              oneMonthChange === null
                ? ""
                : oneMonthChange >= 0
                  ? "text-success"
                  : "text-danger"
            }`}
          >
            {oneMonthChange === null ? "—" : formatCurrency(oneMonthChange)}
          </h4>
        </div>
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Percent Change
          </h6>
          <h4
            className={`fw-bold ${
              netWorthPerChange === null
                ? ""
                : netWorthPerChange >= 0
                  ? "text-success"
                  : "text-danger"
            }`}
          >
            {netWorthPerChange !== null && (
              <FontAwesomeIcon
                icon={netWorthPerChange >= 0 ? faCaretUp : faCaretDown}
              />
            )}
            {netWorthPerChange === null
              ? " —"
              : ` ${Math.abs(netWorthPerChange).toFixed(2)} %`}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Overview;
