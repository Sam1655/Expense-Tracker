import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";

const Overview = ({ consolidatedData, selectedDate, getValues, netWorth, setxAxisField }) => {
  const rc = (str) => +String(str).replace(/,/g, "");

  const selectedMonth = selectedDate;
  const [year, month] = selectedMonth.split("-").map(Number);
  const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);

  const prevMonthdata = consolidatedData?.[prevMonth];
  const curr = consolidatedData?.[selectedDate];

  const projectedExpense = prevMonthdata
    ? curr?.totalIncome +
      prevMonthdata?.netWorth -
      netWorth +
      (getValues("asset.EPF")?.split(",")?.join("") -
        prevMonthdata?.asset?.EPF?.split(",")?.join("") -
        getValues("income.epfIncome")?.split(",")?.join("")) // EPF Int
    : "—";

  const oneMonthChange = netWorth - prevMonthdata?.netWorth;
  const netWorthPerChange =
    ((netWorth - prevMonthdata?.netWorth) / prevMonthdata?.netWorth) * 100;

  const netWorthRet =
    netWorth -
    rc(getValues("asset.SharesInv")) +
    rc(getValues("asset.SharesVal")) -
    rc(getValues("asset.MFInv")) +
    rc(getValues("asset.MFVal"));
  useEffect(() => {
    setxAxisField([
      {
        label: "N/W (Inv)",
        field: "netWorth",
      },
      {
        label: "N/W with Returns",
        field: "netWorthRet",
      },
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
        <h1 className="display-5 fw-bold mb-1">
          ₹{netWorth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h1>
        <p className="text-secondary">Assets − Liabilities</p>
      </div>

      {/* Assets and Liabilities */}
      <div className="row text-center mb-4">
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Assets</h6>
          <h4 className="fw-bold">
            ₹{" "}
            {curr?.totalAssets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Liabilities
          </h6>
          <h4 className="fw-bold">
            ₹{" "}
            {curr?.totalLiabilities
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Income</h6>
          <h4 className="fw-bold">
            ₹{" "}
            {curr?.totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
      </div>

      {/* Divider */}
      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#555",
        }}
      />

      {/* Expenses */}
      <div className="row text-center my-4">
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Projected Expenses
          </h6>
          <h4 className="fw-bold">
            ₹{" "}
            {projectedExpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Actual Expenses
          </h6>
          <h4 className="fw-bold">
            ₹{" "}
            {curr?.totalExpenses
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
      </div>

      {/* Divider */}
      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#555",
        }}
      />

      {/* 1 Month Change */}
      <div className="row text-center my-4">
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            1 Month Change
          </h6>

          <h4
            className={`fw-bold ${
              oneMonthChange >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {prevMonthdata
              ? oneMonthChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "—"}
          </h4>
        </div>
        <div className="col-6">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Percent Change
          </h6>
          <h4
            className={`fw-bold ${
              netWorthPerChange >= 0 ? "text-success" : "text-danger"
            }`}
          >
            <FontAwesomeIcon
              icon={netWorthPerChange >= 0 ? faCaretUp : faCaretDown}
            />

            {prevMonthdata
              ? ` ${Math.abs(netWorthPerChange.toFixed(2))} %`
              : "—"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Overview;
