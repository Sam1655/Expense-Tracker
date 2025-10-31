import { useEffect, useState } from "react";
import TabNavigator from "./Components/TabNavigator";
import Income from "./Components/Income";
import Assets from "./Components/Assets";
import Liabilities from "./Components/Liabilities";
import Expenses from "./Components/Expenses";
import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { TABS } from "./constants";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./NetWorthTracker.css";
import { MOCK_DATA } from "./Components/MockData";

const NetWorthTracker = () => {
  const [activeTab, setActiveTab] = useState(4);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesFields, setExpensesFields] = useState([]);
  const [netWorth, setNetWorth] = useState(totalAssets - totalLiabilities);
  const [consolidatedData, setConsolidatedData] = useState(
    JSON.parse(localStorage.getItem("consolidatedData")) || MOCK_DATA
  );

  console.log(consolidatedData, "consolidatedData");

  useEffect(() => {
    setNetWorth(totalAssets - totalLiabilities);
  }, [totalAssets, totalExpenses, totalIncome, totalLiabilities]);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  const {
    register,
    getValues,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { date: new Date().toISOString().split("T")[0].slice(0, 7) },
  });

  const selectedDate = useWatch({
    control,
    name: "date",
  });

  useEffect(() => {
    // Load Data
    handleDateChange(selectedDate.toString());
  }, [selectedDate]);

  const currentMonth = new Date().toISOString().split("T")[0].slice(0, 7);
  const selectedMonth = getValues("date");
  const [year, month] = selectedMonth.split("-").map(Number);
  const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);

  const prevMonthdata = consolidatedData?.[prevMonth];

  const projectedExpense = prevMonthdata
    ? totalIncome +
      prevMonthdata?.netWorth -
      netWorth +
      (getValues("asset.EPF") -
        prevMonthdata?.asset?.EPF -
        getValues("income.epfIncome")) // EPF Int
    : "—";

  const oneMonthChange = netWorth - prevMonthdata?.netWorth;
  const netWorthPerChange =
    ((netWorth - prevMonthdata?.netWorth) / prevMonthdata?.netWorth) * 100;

  const onSubmit = (data) => {
    data = {
      ...data,
      totalAssets,
      totalLiabilities,
      totalIncome,
      totalExpenses,
      expensesFields,
      netWorth,
    };
    if (!data.netWorth && !expensesFields.length) {
      // toast.error("Error Saving Empty Data!");
      return;
    }

    // Save Data in State and Local Storage
    setConsolidatedData((prev) => {
      prev[data.date] = data;
      localStorage.setItem("consolidatedData", JSON.stringify(prev));
      return { ...prev };
    });

    // toast.success(`Data Saved Successfully for ${data?.date}`);
  };

  const handleDateChange = (date) => {
    const data = consolidatedData?.[date];
    console.log(data, "ssss");
    // Load Data
    if (data) {
      reset();
      setValue("date", date);
      const keys = Object.keys(data);
      const values = Object.values(data);

      for (let i = 0; i < keys.length; i++) {
        setValue(keys[i], values[i]);
      }
      setTotalAssets(data?.totalAssets);
      setTotalLiabilities(data?.totalLiabilities);
      setTotalIncome(data?.totalIncome);
      setTotalExpenses(data?.totalExpenses);
      setExpensesFields(data.expensesFields);
    } else {
      // Empty Prev Data
      console.log("reset kia");
      reset();
      setValue("date", date);
      setTotalAssets(0);
      setTotalLiabilities(0);
      setTotalIncome(0);
      setTotalExpenses(0);
      setExpensesFields([]);
    }
  };

  const Overview = () => (
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
            ₹ {totalAssets.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">
            Liabilities
          </h6>
          <h4 className="fw-bold">
            ₹{" "}
            {totalLiabilities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h4>
        </div>
        <div className="col-4">
          <h6 className="fw-semibold text-uppercase text-secondary">Income</h6>
          <h4 className="fw-bold">
            ₹ {totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
            ₹ {totalExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
      </div>
    </div>
  );

  const returnRenderContent = () => {
    switch (activeTab) {
      case 0:
        return <Overview />;
      case 1:
        return (
          <Assets
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalAssets={totalAssets}
            setTotalAssets={setTotalAssets}
          />
        );
      case 2:
        return (
          <Liabilities
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalLiabilities={totalLiabilities}
            setTotalLiabilities={setTotalLiabilities}
          />
        );
      case 3:
        return (
          <Income
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalIncome={totalIncome}
            setTotalIncome={setTotalIncome}
            prevMonthdata={prevMonthdata}
          />
        );
      case 4:
        return (
          <Expenses
            totalExpenses={totalExpenses}
            setTotalExpenses={setTotalExpenses}
            expensesFields={expensesFields}
            setExpensesFields={setExpensesFields}
            toast={toast}
          />
        );
    }
  };

  const handlePrevMonth = handleSubmit(async (data) => {
    await onSubmit(data);
    const selectedMonth = getValues("date") || currentMonth;
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);
    setValue("date", prevMonth);
  });

  const handleNextMonth = handleSubmit(async (data) => {
    await onSubmit(data);
    const selectedMonth = getValues("date") || currentMonth;
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevMonth = new Date(year, month + 1, 1).toISOString().slice(0, 7);
    setValue("date", prevMonth);
  });
  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex flex-column justify-content-start align-items-center mx-2">
          <div
            className="d-flex flex-column flex-md-row align-items-center justify-content-evenly w-100 px-2 pt-4 gap-2 position-sticky top-0 z-2"
            style={{ backgroundColor: "#242424" }}
          >
            <div className="d-flex align-items-center justify-content-center gap-3">
              <img src="/expense.png" alt="Logo" width={"40"} />
              <h3 className="bg-dark text-light rounded p-1 text-center mb-2 mb-md-0">
                Net Worth & Expense Tracker
              </h3>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-lg-5 gap-4 ">
              <div className="d-flex gap-2 align-items-center">
                <button className="btn btn-dark" onClick={handlePrevMonth}>
                  {"<"}
                </button>
                <input
                  type="month"
                  {...register("date")}
                  control={control}
                  onChange={(e) => {
                    handleSubmit(onSubmit)();
                    handleDateChange(e.target.value);
                  }}
                ></input>
                <button onClick={handleNextMonth} className="btn btn-dark">
                  {">"}
                </button>
              </div>
              <button
                type="submit"
                title="Save"
                className="rounded-circle bg-success d-flex align-items-center justify-content-center border-0"
                style={{ height: "40px", width: "40px" }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                type="button"
                className="btn btn-light rounded-circle"
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(consolidatedData)
                  )
                }
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
          <div className="p-0 row w-100">
            <div className="col-lg-6 col-md-8">
              <TabNavigator
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={TABS}
              >
                {returnRenderContent()}
              </TabNavigator>
            </div>
            <div className="col-lg-6 col-md-4 mt-4 ">
              <Overview />
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default NetWorthTracker;
