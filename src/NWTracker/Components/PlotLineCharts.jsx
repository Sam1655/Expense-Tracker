import { LineChart } from "@mui/x-charts";
import React from "react";

const PlotLineCharts = ({ consolidatedData, xAxisField }) => {
  const rc = (str) => +String(str).replace(/,/g, "");

  const margin = { right: 50 };

  // if (!xAxisField.length) return;

  // Sort the Data Lexically according to Date
  const sortedData = Object.fromEntries(
    Object.entries(consolidatedData).sort(([a], [b]) => a.localeCompare(b))
  );

  const keys = Object.keys(sortedData);
  const values = Object.values(sortedData);

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
  return (
    <LineChart
      series={series}
      xAxis={[
        {
          scaleType: "point",
          data: xLabels,
        },
      ]}
      yAxis={[{ width: 70 }]}
      margin={margin}
    />
  );
};

export default PlotLineCharts;
