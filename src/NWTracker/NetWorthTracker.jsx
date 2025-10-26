import { useEffect, useState } from "react";
import TabNavigator from "./Components/TabNavigator";
import Income from "./Components/Income";
import Assets from "./Components/Assets";
import Liabilities from "./Components/Liabilities";
import Expenses from "./Components/Expenses";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { TABS } from "./constants";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./NetWorthTracker.css";

const NetWorthTracker = () => {
  const [activeTab, setActiveTab] = useState(3);

  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesFields, setExpensesFields] = useState([]);

  const [netWorth, setNetWorth] = useState(totalAssets - totalLiabilities);
  const [consolidatedData, setConsolidatedData] = useState(
    JSON.parse(localStorage.getItem("consolidatedData"))
  );

  useEffect(() => {
    setNetWorth(totalAssets - totalLiabilities);
  }, [totalAssets, totalExpenses, totalIncome, totalLiabilities]);

  const currentMonth = new Date().toISOString().split("T")[0].slice(0, 7);
  useEffect(() => {
    setValue("date", currentMonth);
    handleDateChange({
      target: { value: currentMonth.toString() },
    });
  }, []);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const selectedMonth = getValues("date") || currentMonth;
  const [year, month] = selectedMonth.split("-").map(Number);
  const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);

  const prevMonthdata = consolidatedData?.[prevMonth];

  console.log(prevMonthdata, "prevMonthData");

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
      toast.error("Error Saving Empty Data!");
      return;
    }

    consolidatedData[data.date] = data;
    // setConsolidatedData([...consolidatedData]);

    localStorage.setItem("consolidatedData", JSON.stringify(consolidatedData));
    toast.success(`Data Saved Successfully for ${data?.date}`);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;

    const data = consolidatedData?.[date];

    if (data) {
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
      reset();
      setValue("date", date);
      setTotalAssets(0);
      setTotalLiabilities(0);
      setTotalIncome(0);
      setTotalExpenses(0);
      setExpensesFields([]);
    }
  };

  const returnRenderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Assets
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalAssets={totalAssets}
            setTotalAssets={setTotalAssets}
          />
        );
      case 1:
        return (
          <Liabilities
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalLiabilities={totalLiabilities}
            setTotalLiabilities={setTotalLiabilities}
          />
        );
      case 2:
        return (
          <Income
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalIncome={totalIncome}
            setTotalIncome={setTotalIncome}
          />
        );
      case 3:
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
  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex flex-column justify-content-start align-items-center mt-4 mx-2">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-evenly w-100 px-2 gap-2">
            <div className="d-flex align-items-center justify-content-center gap-3">
              <img src="/expense.png" alt="Logo" width={"40"} />
              <h3 className="bg-dark text-light rounded p-1 text-center mb-2 mb-md-0">
                Net Worth & Expense Tracker
              </h3>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-lg-5 gap-4 ">
              <input
                type="month"
                className=""
                {...register("date")}
                onChange={handleDateChange}
              ></input>
              <button
                type="submit"
                title="Save"
                className="rounded-circle bg-success d-flex align-items-center justify-content-center border-0"
                style={{ height: "40px", width: "40px" }}
              >
                <FontAwesomeIcon icon={faCheck} />
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
                  <h1 className="display-5 fw-bold mb-1">₹ {netWorth}</h1>
                  <p className="text-secondary">Assets − Liabilities</p>
                </div>

                {/* Assets and Liabilities */}
                <div className="row text-center mb-4">
                  <div className="col-6">
                    <h6 className="fw-semibold text-uppercase text-secondary">
                      Assets
                    </h6>
                    <h4 className="fw-bold">₹ {totalAssets}</h4>
                  </div>
                  <div className="col-6">
                    <h6 className="fw-semibold text-uppercase text-secondary">
                      Liabilities
                    </h6>
                    <h4 className="fw-bold">₹ {totalLiabilities}</h4>
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
                    <h4 className="fw-bold">₹ —</h4>
                  </div>
                  <div className="col-6">
                    <h6 className="fw-semibold text-uppercase text-secondary">
                      Actual Expenses
                    </h6>
                    <h4 className="fw-bold">₹ {totalExpenses}</h4>
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
                        netWorth - prevMonthdata?.netWorth >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {prevMonthdata ? netWorth - prevMonthdata?.netWorth : "—"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default NetWorthTracker;
