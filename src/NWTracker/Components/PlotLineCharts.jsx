import { LineChart } from "@mui/x-charts";
import React from "react";
import { rc } from "../NetWorthTracker";

const PlotLineCharts = ({ consolidatedData, xAxisField }) => {
  const margin = { right:50};

  // if (!xAxisField.length) return;

  // Sort the Data Lexically according to Date
  const sortedData = Object.fromEntries(
    Object.entries(consolidatedData).sort(([a], [b]) => a.localeCompare(b)),
  );

  const keys = Object.keys(sortedData);
  const values = Object.values(sortedData);

  if (!values[values.length - 1]?.netWorth) {
    keys.pop();
    values.pop();
  }

  const xLabels = [];
  const series = xAxisField.map((row) => {
    return {
      showMark: false,
      label: row.label,
      field: row.field,
      data: [],
    };
  });

  keys.forEach((k, i) => {
    const val = values[i];

    for (const s of series) {
      // s.data.push(rc(val.asset[s.field]));
      const hasDot = s?.field?.includes(".");
      const [key1, key2] = hasDot ? s?.field.split(".") : [];

      const data = hasDot ? val[key1]?.[key2] : val[s?.field];

      s.data.push(rc(data));
    }

    xLabels.push(k);
  });

  const formatXAxisLabel = (value) => {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  };

  const formatYAxisLabel = (value) => {
    const absoluteValue = Math.abs(value);
    if (absoluteValue >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    }
    if (absoluteValue >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }
    if (absoluteValue >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString("en-IN");
  };

  return (
    <LineChart
      series={series}
      xAxis={[
        {
          scaleType: "point",
          data: xLabels,
          valueFormatter: formatXAxisLabel,
          tickLabelInterval: (_, index) =>
            xLabels.length <= 10 ||
            index % Math.ceil(xLabels.length / 10) !== 0,
          tickLabelStyle: {
            // textAnchor: "end",
            fontSize: 12,
          },
        },
      ]}
      yAxis={[{ width: 90, valueFormatter: formatYAxisLabel }]}
      margin={margin}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "#242424",
            color: "#fff",
            "& .MuiChartsTooltip-cell": {
              color: "#fff",
            },
            "& .MuiChartsTooltip-labelCell": {
              color: "#fff",
            },
            "& .MuiChartsTooltip-valueCell": {
              color: "#fff",
            },
            "& .MuiChartsTooltip-axisValueCell": {
              color: "#fff !important",
            },
            "& th, & td": {
              color: "#fff !important",
            },
            "& caption.MuiTypography-root": {
              color: "#ddd !important",
            },
            "& .MuiTypography-root": {
              color: "#fff !important",
            },
          },
        },
      }}
    />
  );
};

export default PlotLineCharts;
