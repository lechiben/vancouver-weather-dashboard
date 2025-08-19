// components/charts/CustomTooltip.jsx
import React from "react";

/**
 * Custom Tooltip Component for Recharts
 * Provides formatted tooltips with proper units and styling
 */
const CustomTooltip = ({ active, payload, label, customFormatter }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  /**
   * Get appropriate unit for a data key
   * @param {string} dataKey - The data key
   * @returns {string} Unit symbol
   */
  const getUnit = (dataKey) => {
    if (dataKey.includes("temp") || dataKey.includes("Temp")) return "°C";
    if (dataKey === "rainfall" || dataKey === "precipitation") return "mm";
    if (dataKey === "humidity") return "%";
    if (dataKey === "sunshine") return "hrs";
    if (dataKey === "pressure") return "hPa";
    if (dataKey === "windSpeed") return "km/h";
    if (dataKey.includes("total") && dataKey.includes("Rainfall")) return "mm";
    if (dataKey.includes("total") && dataKey.includes("Sunshine")) return "hrs";
    return "";
  };

  /**
   * Format value with appropriate precision
   * @param {number} value - The value to format
   * @param {string} dataKey - The data key
   * @returns {string} Formatted value
   */
  const formatValue = (value, dataKey) => {
    if (typeof value !== "number") return value;

    // Temperature values - 1 decimal place
    if (dataKey.includes("temp") || dataKey.includes("Temp")) {
      return value.toFixed(1);
    }

    // Rainfall and sunshine - 1 decimal place
    if (dataKey === "rainfall" || dataKey === "sunshine") {
      return value.toFixed(1);
    }

    // Humidity - whole numbers
    if (dataKey === "humidity") {
      return Math.round(value);
    }

    // Default - 1 decimal place for most metrics
    return value.toFixed(1);
  };

  /**
   * Get friendly name for data key
   * @param {string} dataKey - The data key
   * @returns {string} Display name
   */
  const getFriendlyName = (dataKey) => {
    const nameMap = {
      temp: "Average Temperature",
      tempMin: "Minimum Temperature",
      tempMax: "Maximum Temperature",
      rainfall: "Rainfall",
      humidity: "Humidity",
      sunshine: "Sunshine Hours",
      pressure: "Pressure",
      windSpeed: "Wind Speed",
      totalRainfall: "Total Rainfall",
      totalSunshine: "Total Sunshine",
      avgTemp: "Average Temperature",
      avgHumidity: "Average Humidity",
    };

    return (
      nameMap[dataKey] || dataKey.charAt(0).toUpperCase() + dataKey.slice(1)
    );
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
      {/* Header with label */}
      <p className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">
        {label}
      </p>

      {/* Payload entries */}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Color indicator */}
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />

              {/* Label */}
              <span className="text-sm text-gray-700">
                {getFriendlyName(entry.dataKey)}:
              </span>
            </div>

            {/* Value */}
            <span
              className="font-medium text-sm ml-2"
              style={{ color: entry.color }}
            >
              {customFormatter
                ? customFormatter(entry.value, entry.dataKey)
                : `${formatValue(entry.value, entry.dataKey)}${getUnit(
                    entry.dataKey
                  )}`}
            </span>
          </div>
        ))}
      </div>

      {/* Additional info if needed */}
      {payload.length > 3 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {payload.length} metrics shown
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Correlation Tooltip - Specialized for scatter plots
 */
export const CorrelationTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-800 mb-2">{data.month || label}</p>

      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => {
          if (key === "month" || key === "date" || key === "year") return null;

          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {getFriendlyName(key)}:
              </span>
              <span className="font-medium text-sm text-gray-800 ml-2">
                {typeof value === "number"
                  ? `${value.toFixed(1)}${getUnit(key)}`
                  : value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Simple Tooltip - Minimal version for clean charts
 */
export const SimpleTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const entry = payload[0];

  return (
    <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm">
      <span>{label}: </span>
      <span className="font-medium">
        {formatValue(entry.value, entry.dataKey)}
        {getUnit(entry.dataKey)}
      </span>
    </div>
  );
};

// Helper function also used by other components
const getFriendlyName = (dataKey) => {
  const nameMap = {
    temp: "Average Temperature",
    tempMin: "Minimum Temperature",
    tempMax: "Maximum Temperature",
    rainfall: "Rainfall",
    humidity: "Humidity",
    sunshine: "Sunshine Hours",
    pressure: "Pressure",
    windSpeed: "Wind Speed",
    totalRainfall: "Total Rainfall",
    totalSunshine: "Total Sunshine",
    avgTemp: "Average Temperature",
    avgHumidity: "Average Humidity",
  };

  return nameMap[dataKey] || dataKey.charAt(0).toUpperCase() + dataKey.slice(1);
};

// Helper function for formatting
const formatValue = (value, dataKey) => {
  if (typeof value !== "number") return value;

  if (dataKey.includes("temp") || dataKey.includes("Temp")) {
    return value.toFixed(1);
  }

  if (dataKey === "rainfall" || dataKey === "sunshine") {
    return value.toFixed(1);
  }

  if (dataKey === "humidity") {
    return Math.round(value);
  }

  return value.toFixed(1);
};

// Helper function for units
const getUnit = (dataKey) => {
  if (dataKey.includes("temp") || dataKey.includes("Temp")) return "°C";
  if (dataKey === "rainfall" || dataKey === "precipitation") return "mm";
  if (dataKey === "humidity") return "%";
  if (dataKey === "sunshine") return "hrs";
  if (dataKey === "pressure") return "hPa";
  if (dataKey === "windSpeed") return "km/h";
  if (dataKey.includes("total") && dataKey.includes("Rainfall")) return "mm";
  if (dataKey.includes("total") && dataKey.includes("Sunshine")) return "hrs";
  return "";
};

export default CustomTooltip;
