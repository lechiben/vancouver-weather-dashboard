// components/charts/TemperatureChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { CHART_COLORS, CHART_DIMENSIONS } from "../../utils/constants.js";
import CustomTooltip from "./CustomTooltip.jsx";

/**
 * Temperature Chart Component
 * Renders various temperature visualizations
 */
const TemperatureChart = ({
  data,
  type = "line",
  showMinMax = true,
  size = "medium",
  title,
  subtitle,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No temperature data available</p>
      </div>
    );
  }

  const dimensions =
    CHART_DIMENSIONS[size.toUpperCase()] || CHART_DIMENSIONS.MEDIUM;

  const renderLineChart = () => (
    <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {showMinMax && (
          <>
            <Line
              type="monotone"
              dataKey="tempMax"
              stroke={CHART_COLORS.temperatureMax}
              strokeWidth={3}
              name="Max Temperature"
              dot={{ fill: CHART_COLORS.temperatureMax, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              stroke={CHART_COLORS.temperatureMin}
              strokeWidth={3}
              name="Min Temperature"
              dot={{ fill: CHART_COLORS.temperatureMin, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </>
        )}

        <Line
          type="monotone"
          dataKey="temp"
          stroke={CHART_COLORS.temperature}
          strokeWidth={3}
          name="Average Temperature"
          dot={{ fill: CHART_COLORS.temperature, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {showMinMax ? (
          <>
            <Bar
              dataKey="tempMin"
              fill={CHART_COLORS.temperatureMin}
              name="Min Temperature"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="tempMax"
              fill={CHART_COLORS.temperatureMax}
              name="Max Temperature"
              radius={[4, 4, 0, 0]}
            />
          </>
        ) : (
          <Bar
            dataKey="temp"
            fill={CHART_COLORS.temperature}
            name="Average Temperature"
            radius={[4, 4, 4, 4]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          )}
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>
      )}

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        {renderChart()}
      </div>
    </div>
  );
};

/**
 * Temperature Range Chart - Specialized component for showing temperature ranges
 */
export const TemperatureRangeChart = ({ data, size = "medium", title }) => {
  return (
    <TemperatureChart
      data={data}
      type="bar"
      showMinMax={true}
      size={size}
      title={title || "Temperature Range by Month"}
      subtitle="Monthly minimum and maximum temperature comparison"
    />
  );
};

/**
 * Temperature Trend Chart - Specialized component for trend analysis
 */
export const TemperatureTrendChart = ({ data, size = "large", title }) => {
  return (
    <TemperatureChart
      data={data}
      type="line"
      showMinMax={true}
      size={size}
      title={title || "Temperature Trends"}
      subtitle="Long-term temperature patterns and variations"
    />
  );
};

/**
 * Simple Temperature Chart - Clean version with just average temperatures
 */
export const SimpleTemperatureChart = ({ data, size = "medium", title }) => {
  return (
    <TemperatureChart
      data={data}
      type="line"
      showMinMax={false}
      size={size}
      title={title || "Average Temperature"}
      subtitle="Monthly average temperature patterns"
    />
  );
};

export default TemperatureChart;
