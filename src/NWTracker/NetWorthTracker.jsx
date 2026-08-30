import { useEffect, useState, useRef } from "react";
import TabNavigator from "./Components/TabNavigator";
import Income from "./Components/Income";
import Assets from "./Components/Assets";
import Liabilities from "./Components/Liabilities";
import Expenses from "./Components/Expenses";
import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCopy,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { TABS } from "./constants";
import { ToastContainer, toast } from "react-toastify";
import { MOCK_DATA } from "./Components/MockData";

import "react-toastify/dist/ReactToastify.css";
import "./NetWorthTracker.css";

import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PlotLineCharts from "./Components/PlotLineCharts";
import Overview from "./Components/Overview";
import AddExpenseModal from "./Components/AddExpenseModal";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// export const rc = (str) => +String(str).replace(/,/g, "");
export const rc = (str) => {
  // Remove Comma
  const n = Number(String(str ?? "0").replace(/,/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const currentMonth = new Date().toISOString().split("T")[0].slice(0, 7);

const NetWorthTracker = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [modal, setModal] = useState({});
  const [xAxisField, setxAxisField] = useState([]);
  const [expensesFields, setExpensesFields] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  // const [netWorth, setNetWorth] = useState(totalAssets - totalLiabilities);
  const [consolidatedData, setConsolidatedData] = useState(
    JSON.parse(localStorage.getItem("consolidatedData")) || MOCK_DATA,
  );
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Debouncing for Auto Save
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      console.warn("Announced : Data saved in LocalStorage");
      localStorage.setItem(
        "consolidatedData",
        JSON.stringify(consolidatedData),
      );
      // toast.success(`Data Saved Successfully for ${selectedMonth}`);
    }, 500);
  }, [consolidatedData]);

  console.log(consolidatedData, "consolidatedData");

  // useEffect(() => {
  //   setNetWorth(totalAssets - totalLiabilities);
  // }, [totalAssets, totalExpenses, totalIncome, totalLiabilities]);

  const {
    register,
    getValues,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { date: currentMonth },
  });

  const selectedDate = useWatch({
    control,
    name: "date",
  });

  if (!selectedDate) setValue("date", currentMonth);

  useEffect(() => {
    // Load Data
    handleDateChange(selectedDate.toString());
  }, [selectedDate]);

  const selectedMonth = getValues("date");
  const [year, month] = selectedMonth.split("-").map(Number);
  const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);

  const prevMonthdata = consolidatedData?.[prevMonth];
  const netWorth = totalAssets - totalLiabilities;
  const netWorthRet =
    netWorth -
    rc(getValues("asset.SharesInv")) +
    rc(getValues("asset.SharesVal")) -
    rc(getValues("asset.MFInv")) +
    rc(getValues("asset.MFVal"));

  useEffect(() => {
    handleSubmit(onSubmit)();
  }, [
    totalAssets,
    totalLiabilities,
    totalIncome,
    totalExpenses,
    expensesFields,
  ]);

  const onSubmit = (data) => {
    data = {
      ...data,
      totalAssets,
      totalLiabilities,
      totalIncome,
      totalExpenses,
      expensesFields,
      netWorth,
      netWorthRet,
    };
    console.log(data, "datasss");
    if (
      !data.totalAssets &&
      !data.totalLiabilities &&
      !data.totalIncome &&
      !expensesFields?.length &&
      !consolidatedData[data.date]
    ) {
      console.warn("Announced : Empty Data Not saved in State");
      return;
    }

    // Set Data in State
    setConsolidatedData((prev) => {
      prev[data.date] = data;

      // Remove any Empty Entries from Consolidated Data
      const emptyData = Object.entries(prev).find(
        (arr) =>
          !arr[1].totalAssets &&
          !arr[1].totalLiabilities &&
          !arr[1].totalIncome &&
          !arr[1].expensesFields?.length,
      );

      if (emptyData) {
        delete prev[emptyData[0]];
        console.warn(
          "Announced : Empty Data deleted in State : ",
          emptyData[0],
        );
      }
      // localStorage.setItem("consolidatedData", JSON.stringify(prev));
      console.warn("Announced : Data saved in State");
      return { ...prev };
    });

    // toast.success(`Data Saved Successfully for ${data?.date}`);
  };

  const handleDateChange = (date) => {
    const data = consolidatedData?.[date];
    if (
      data?.date === currentMonth &&
      consolidatedData?.[currentMonth]?.expensesFields.length
    )
      setActiveTab(4);
    // Load Data
    if (data) {
      console.warn("Announced handleDateChange : Loading New Data for ", date);
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
      console.warn(
        "Announced handleDateChange : No Prev Data Found for ",
        date,
      );
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
          <Overview
            consolidatedData={consolidatedData}
            selectedDate={selectedDate}
            getValues={getValues}
            netWorth={netWorth}
            setxAxisField={setxAxisField}
          />
        );
      case 1:
        return (
          <Assets
            register={register}
            getValues={getValues}
            setValue={setValue}
            totalAssets={totalAssets}
            setTotalAssets={setTotalAssets}
            prevMonthdata={prevMonthdata}
            setxAxisField={setxAxisField}
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
            setxAxisField={setxAxisField}
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
            setxAxisField={setxAxisField}
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
            setModal={setModal}
          />
        );
    }
  };

  function getTop7Expenses() {
    // Step 1: Merge same-label items
    const data = expensesFields;
    const merged = Object.values(
      data.reduce((acc, { label, value, timestamp }) => {
        const numValue = rc(value); // ensure numeric
        if (!acc[label]) {
          acc[label] = { label, value: numValue, timestamp };
        } else {
          acc[label].value += numValue;
        }
        return acc;
      }, {}),
    );

    // Step 2: Sort by value descending
    merged.sort((a, b) => b.value - a.value);

    // Step 3: Keep top 6
    return merged.slice(0, 7);
  }

  const returnRenderGraph = () => {
    switch (activeTab) {
      case 0: {
        return (
          <PlotLineCharts
            consolidatedData={consolidatedData}
            xAxisField={xAxisField}
          />
        );
      }
      case 1: {
        return (
          <PlotLineCharts
            consolidatedData={consolidatedData}
            xAxisField={xAxisField}
          />
        );
      }
      case 2: {
        return (
          <PlotLineCharts
            consolidatedData={consolidatedData}
            xAxisField={xAxisField}
          />
        );
      }
      case 3: {
        return (
          <PlotLineCharts
            consolidatedData={consolidatedData}
            xAxisField={xAxisField}
          />
        );
      }

      case 4:
        if (!expensesFields.length) return <div>No Expenses</div>;
        const data = getTop7Expenses();

        const size = {
          width: 300,
          height: 300,
        };

        const StyledText = styled("text")(({ theme }) => ({
          fill: theme.palette.text.primary,
          textAnchor: "middle",
          dominantBaseline: "central",
          fontSize: 20,
        }));

        function PieCenterLabel({ children }) {
          const { width, height, left, top } = useDrawingArea();
          return (
            <StyledText x={left + width / 2} y={top + height / 2}>
              {children}
            </StyledText>
          );
        }
        return (
          <PieChart series={[{ data, innerRadius: 90 }]} {...size}>
            <PieCenterLabel>Top Expenses</PieCenterLabel>
          </PieChart>
        );
    }
  };

  const handlePrevMonth = handleSubmit((data) => {
    const selectedMonth = getValues("date") || currentMonth;
    const [year, month] = selectedMonth.split("-").map(Number);
    const prevMonth = new Date(year, month - 1, 1).toISOString().slice(0, 7);
    setValue("date", prevMonth);
  });

  const handleNextMonth = handleSubmit((data) => {
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
            className="d-flex flex-column flex-md-row align-items-center justify-content-evenly w-100 px-2 py-2 gap-2 position-sticky top-0 z-2"
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
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={handlePrevMonth}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <input
                  type="month"
                  {...register("date")}
                  // control={control}
                  // onChange={(e) => {
                  //   handleDateChange(e.target.value);
                  // }}
                ></input>
                <button
                  onClick={handleNextMonth}
                  type="button"
                  className="btn btn-dark"
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-light rounded-circle"
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(consolidatedData),
                  )
                }
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
          <div className="p-0 row w-100">
            <div className="col-lg-6 ">
              <TabNavigator
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={TABS}
              >
                {returnRenderContent()}
              </TabNavigator>
            </div>
            <div className="col-lg-6 responsive-container">
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box sx={{ width: "100%", height: "100%" }} className="d-flex">
                  {returnRenderGraph()}
                </Box>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
      {modal.isOpen && (
        <AddExpenseModal
          expensesFields={expensesFields}
          setExpensesFields={setExpensesFields}
          setModal={setModal}
          index={modal.index}
          toast={toast}
        />
      )}
    </div>
  );
};

export default NetWorthTracker;
