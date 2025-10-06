// src/components/molecules/CustomChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const CustomChart = ({
  type = "line",       // "line", "bar", "pie"
  data = [],
  dataKey = "value",
  nameKey = "name",
  colors = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#a78bfa"],
  height = 300,
  showLegend = true,
  showGrid = true,
}) => {
  if (!data || data.length === 0) return <p className="text-center py-6">No data available</p>;

  switch (type) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            {showGrid && <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />}
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            {showGrid && <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />}
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar dataKey={dataKey} fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={height / 2 - 20} label>
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showLegend && <Legend />}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};

export default CustomChart;
