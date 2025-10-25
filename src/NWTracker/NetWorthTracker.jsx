import { useEffect, useState } from "react";
import TabNavigator from "./Components/TabNavigator";
import Income from "./Components/Income";
import { useForm } from "react-hook-form";
import Assets from "./Components/Assets";
import Liabilities from "./Components/Liabilities";
import Expenses from "./Components/Expenses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./NetWorthTracker.css";
import { TABS } from "./constants";

const NetWorthTracker = () => {
  const [activeTab, setActiveTab] = useState(3);

  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesFields, setExpensesFields] = useState([]);

  const [netWorth, setNetWorth] = useState(totalAssets - totalLiabilities);

  useEffect(() => {
    setNetWorth(totalAssets - totalLiabilities);
  }, [totalAssets, totalExpenses, totalIncome, totalLiabilities]);

  useEffect(() => {
    const currentMonth = new Date().toISOString().split("T")[0].slice(0, 7);
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
    console.log(data);
    if (!data.netWorth) {
      alert("Please Fill the Data");
      return;
    }

    if (
      JSON.parse(localStorage.getItem("expenseData"))?.[data.date] &&
      !window.confirm(`Do you want to Modify the Data for ${data.date}`)
    ) {
      alert("Data Not Saved");
      return;
    }
    let expenseData = JSON.parse(localStorage.getItem("expenseData")) || {};
    expenseData[data.date] = data;

    localStorage.setItem("expenseData", JSON.stringify(expenseData));
    alert("Data Saved");
  };

  const handleDateChange = (e) => {
    const date = e.target.value;

    const data = JSON.parse(localStorage.getItem("expenseData"))?.[date];
    console.log(data, "dataaa");

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
          />
        );
    }
  };
  return (
    <div className="main-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex flex-column justify-content-start align-items-center mt-4 mx-2">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-evenly w-100 px-2 gap-2">
            <h3 className="bg-dark text-light rounded p-1 text-center mb-2 mb-md-0">
              Net Worth & Expense Tracker
            </h3>
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
          <div className="row w-100">
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
              <div className="">
                <div className="row mt-4 justify-content-center align-items-center">
                  <span className="col-4">Total Assets : </span>
                  <span className="col-6">Rs. {totalAssets}</span>
                </div>
                <div className="row mt-4 justify-content-center align-items-center">
                  <span className="col-4">Total Liabilities : </span>
                  <span className="col-6">Rs. {totalLiabilities}</span>
                </div>
                <div className="row mt-4 justify-content-center align-items-center">
                  <span className="col-4">Total Income : </span>
                  <span className="col-6">Rs. {totalIncome}</span>
                </div>
                <div className="row mt-4 justify-content-center align-items-center">
                  <span className="col-4">Total Expenses : </span>
                  <span className="col-6">Rs. {totalExpenses}</span>
                </div>
                <div className="row mt-4 justify-content-center align-items-center">
                  <span className="col-4">Net Worth : </span>
                  <span className="col-6">Rs. {netWorth}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NetWorthTracker;
