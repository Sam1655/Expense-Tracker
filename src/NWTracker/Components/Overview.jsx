import {
  faCaretDown,
  faCaretUp,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { rc } from "../NetWorthTracker";

// Guards against undefined/null values and gives Indian digit grouping (1,23,456)
const formatCurrency = (num, showFullValue) => {
  const n = Number(num) || 0;

  if (showFullValue) {
    // Returns Full Value 12,23,456 instead of 12.23L
    return n.toLocaleString("en-IN");
  }
  if (n >= 10000000) {
    return `${(num / 10000000).toFixed(2)}Cr`;
  }
  if (n >= 100000) {
    return `${(num / 100000).toFixed(2)}L`;
  }
  if (n >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return n.toLocaleString("en-IN");
};

const Overview = ({
  consolidatedData,
  selectedDate,
  getValues,
  netWorth,
  setxAxisField,
}) => {
  const [showDetails, setShowDetails] = useState(false);
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

  const projectedExpense =
    hasPrevMonth && netWorth
      ? (curr?.totalIncome ?? 0) +
        prevMonthdata.netWorth -
        netWorth +
        (currEPF - prevEPF - epfIncome) // EPF Int
      : null;

  const oneMonthChange =
    hasPrevMonth && netWorth ? netWorth - prevMonthdata.netWorth : null;

  const netWorthPerChange =
    hasPrevMonth && netWorth && prevMonthdata.netWorth !== 0
      ? ((netWorth - prevMonthdata.netWorth) / prevMonthdata.netWorth) * 100
      : null;

  const displayCurrency = (value, showFullValue = false) =>
    showDetails || !value ? formatCurrency(value, showFullValue) : "****";

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
      <div className="mb-3 d-flex align-items-center justify-content-center gap-4">
        <p className="m-0 fs-5 fw-medium">My Networth</p>
        <button
          type="button"
          className="btn btn-sm btn-dark"
          onClick={() => setShowDetails((visible) => !visible)}
          aria-label={
            showDetails ? "Hide financial details" : "Show financial details"
          }
          title={
            showDetails ? "Hide financial details" : "Show financial details"
          }
        >
          <FontAwesomeIcon icon={showDetails ? faEyeSlash : faEye} />
        </button>
      </div>

      {/* Main Net Worth */}
      <div className="d-flex align-items-center justify-content-center gap-2">
        <h1 className="display-5 fw-bold mb-1">
          ₹{displayCurrency(netWorth, true)}
        </h1>
      </div>
      <p className="text-secondary">Assets − Liabilities</p>

      {/* Assets and Liabilities */}
      <div className="row text-center mb-4">
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Assets</h6>
          <h4 className="fw-bold">₹ {displayCurrency(curr?.totalAssets)}</h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Liabilities
          </h6>
          <h4 className="fw-bold">
            ₹ {displayCurrency(curr?.totalLiabilities)}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Income</h6>
          <h4 className="fw-bold">₹ {displayCurrency(curr?.totalIncome)}</h4>
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
              : `₹ ${displayCurrency(projectedExpense, true)}`}
          </h4>
        </div>
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Recorded Expenses
          </h6>
          <h4 className="fw-bold">
            ₹ {displayCurrency(curr?.totalExpenses, true)}
          </h4>
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
            {oneMonthChange === null ? "—" : displayCurrency(oneMonthChange)}
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
              : showDetails
                ? ` ${Math.abs(netWorthPerChange).toFixed(2)} %`
                : " ****"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Overview;
