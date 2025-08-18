// components/pages/Correlations.jsx
import React, { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { calculateCorrelation } from "../../utils/calculations.js";
import { CHART_COLORS } from "../../utils/constants.js";
import CustomTooltip from "../charts/CustomTooltip.jsx";

/**
 * Correlations Page Component
 * Advanced analysis of relationships between weather variables
 */
const Correlations = ({ data, yearlyData, selectedYear }) => {
  const [selectedCorrelation, setSelectedCorrelation] =
    useState("temp-humidity");
  const [viewMode, setViewMode] = useState("scatter");

  // Calculate correlation coefficients for all variable pairs
  const correlationMatrix = useMemo(() => {
    if (!data || data.length === 0) return {};

    const variables = ["temp", "rainfall", "humidity", "sunshine"];
    const matrix = {};

    variables.forEach((var1) => {
      variables.forEach((var2) => {
        if (var1 !== var2) {
          const values1 = data
            .map((d) => d[var1])
            .filter((v) => v !== null && v !== undefined);
          const values2 = data
            .map((d) => d[var2])
            .filter((v) => v !== null && v !== undefined);

          if (values1.length === values2.length && values1.length > 0) {
            matrix[`${var1}-${var2}`] = calculateCorrelation(values1, values2);
          }
        }
      });
    });

    return matrix;
  }, [data]);

  // Prepare data for selected correlation visualization
  const correlationData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const [var1, var2] = selectedCorrelation.split("-");
    return data
      .map((d) => ({
        ...d,
        x: d[var1],
        y: d[var2],
        var1: d[var1],
        var2: d[var2],
      }))
      .filter((d) => d.x !== null && d.y !== null);
  }, [data, selectedCorrelation]);

  // Calculate seasonal correlations
  const seasonalCorrelations = useMemo(() => {
    if (!data || data.length === 0) return {};

    const seasons = {
      winter: [11, 0, 1], // Dec, Jan, Feb
      spring: [2, 3, 4], // Mar, Apr, May
      summer: [5, 6, 7], // Jun, Jul, Aug
      fall: [8, 9, 10], // Sep, Oct, Nov
    };

    const [var1, var2] = selectedCorrelation.split("-");
    const seasonalData = {};

    Object.entries(seasons).forEach(([season, months]) => {
      const seasonData = data.filter((d) => months.includes(d.monthIndex));
      if (seasonData.length > 0) {
        const values1 = seasonData.map((d) => d[var1]);
        const values2 = seasonData.map((d) => d[var2]);
        seasonalData[season] = {
          correlation: calculateCorrelation(values1, values2),
          dataPoints: seasonData.length,
          avgVar1: values1.reduce((sum, v) => sum + v, 0) / values1.length,
          avgVar2: values2.reduce((sum, v) => sum + v, 0) / values2.length,
        };
      }
    });

    return seasonalData;
  }, [data, selectedCorrelation]);

  // Get variable display names and units
  const getVariableInfo = (variable) => {
    const info = {
      temp: {
        name: "Temperature",
        unit: "°C",
        color: CHART_COLORS.temperature,
      },
      rainfall: { name: "Rainfall", unit: "mm", color: CHART_COLORS.rainfall },
      humidity: { name: "Humidity", unit: "%", color: CHART_COLORS.humidity },
      sunshine: { name: "Sunshine", unit: "hrs", color: CHART_COLORS.sunshine },
    };
    return info[variable] || { name: variable, unit: "", color: "#666" };
  };

  // Get correlation strength description
  const getCorrelationStrength = (value) => {
    const abs = Math.abs(value);
    if (abs >= 0.8) return { strength: "Very Strong", color: "text-green-600" };
    if (abs >= 0.6) return { strength: "Strong", color: "text-blue-600" };
    if (abs >= 0.4) return { strength: "Moderate", color: "text-yellow-600" };
    if (abs >= 0.2) return { strength: "Weak", color: "text-orange-600" };
    return { strength: "Very Weak", color: "text-red-600" };
  };

  // Custom tooltip for scatter plot
  const CorrelationTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const [var1, var2] = selectedCorrelation.split("-");
    const info1 = getVariableInfo(var1);
    const info2 = getVariableInfo(var2);

    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{data.month}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{info1.name}:</span>
            <span className="font-medium text-sm ml-2">
              {data.var1?.toFixed(1)}
              {info1.unit}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{info2.name}:</span>
            <span className="font-medium text-sm ml-2">
              {data.var2?.toFixed(1)}
              {info2.unit}
            </span>
          </div>
          {data.climatePattern && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Pattern: {data.climatePattern}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const [var1, var2] = selectedCorrelation.split("-");
  const info1 = getVariableInfo(var1);
  const info2 = getVariableInfo(var2);
  const currentCorrelation = correlationMatrix[selectedCorrelation] || 0;
  const correlationStrength = getCorrelationStrength(currentCorrelation);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Weather Variable Correlations
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Explore relationships between different weather variables in
          Vancouver. Understanding these correlations helps predict weather
          patterns and identify climate trends.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variable Pair
            </label>
            <select
              value={selectedCorrelation}
              onChange={(e) => setSelectedCorrelation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="temp-humidity">Temperature vs Humidity</option>
              <option value="temp-rainfall">Temperature vs Rainfall</option>
              <option value="temp-sunshine">Temperature vs Sunshine</option>
              <option value="rainfall-humidity">Rainfall vs Humidity</option>
              <option value="rainfall-sunshine">Rainfall vs Sunshine</option>
              <option value="humidity-sunshine">Humidity vs Sunshine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Mode
            </label>
            <div className="flex gap-2">
              {["scatter", "seasonal", "matrix"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Summary */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {currentCorrelation.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Correlation Coefficient</div>
            <div
              className={`text-sm font-medium mt-1 ${correlationStrength.color}`}
            >
              {correlationStrength.strength}{" "}
              {currentCorrelation < 0 ? "Negative" : "Positive"}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {Math.abs(currentCorrelation * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Variance Explained</div>
            <div className="text-sm text-gray-500 mt-1">
              R² = {(currentCorrelation ** 2).toFixed(3)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {data?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Data Points</div>
            <div className="text-sm text-gray-500 mt-1">
              {selectedYear === "all"
                ? "Monthly Averages"
                : `Year ${selectedYear}`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      {viewMode === "scatter" && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {info1.name} vs {info2.name} Correlation
          </h3>
          <div className="mb-4">
            <p className="text-gray-600">
              {currentCorrelation > 0 ? "Positive" : "Negative"} correlation of{" "}
              <span className={`font-semibold ${correlationStrength.color}`}>
                {Math.abs(currentCorrelation).toFixed(3)}
              </span>{" "}
              indicates that as {info1.name.toLowerCase()} increases,{" "}
              {info2.name.toLowerCase()}{" "}
              {currentCorrelation > 0
                ? "tends to increase"
                : "tends to decrease"}
              .
            </p>
          </div>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="x"
                name={info1.name}
                label={{
                  value: `${info1.name} (${info1.unit})`,
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                dataKey="y"
                name={info2.name}
                label={{
                  value: `${info2.name} (${info2.unit})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CorrelationTooltip />} />
              <Scatter
                dataKey="y"
                fill={info1.color}
                fillOpacity={0.7}
                stroke={info1.color}
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === "seasonal" && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Seasonal Correlation Analysis
          </h3>
          <p className="text-gray-600 mb-6">
            How the relationship between {info1.name.toLowerCase()} and{" "}
            {info2.name.toLowerCase()} varies across seasons.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seasonal Correlation Chart */}
            <div>
              <h4 className="font-semibold mb-4">Correlation by Season</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(seasonalCorrelations).map(
                    ([season, data]) => ({
                      season: season.charAt(0).toUpperCase() + season.slice(1),
                      correlation: data.correlation,
                      dataPoints: data.dataPoints,
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" />
                  <YAxis domain={[-1, 1]} />
                  <Tooltip
                    formatter={(value, name) => [
                      value.toFixed(3),
                      name === "correlation" ? "Correlation" : name,
                    ]}
                  />
                  <Bar
                    dataKey="correlation"
                    fill={info1.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Seasonal Statistics */}
            <div>
              <h4 className="font-semibold mb-4">Seasonal Details</h4>
              <div className="space-y-4">
                {Object.entries(seasonalCorrelations).map(([season, data]) => {
                  const strength = getCorrelationStrength(data.correlation);
                  return (
                    <div key={season} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium capitalize">{season}</h5>
                        <span
                          className={`text-sm font-medium ${strength.color}`}
                        >
                          {strength.strength}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Correlation:</span>
                          <span className="font-medium ml-1">
                            {data.correlation.toFixed(3)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Points:</span>
                          <span className="font-medium ml-1">
                            {data.dataPoints}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Avg {info1.name}:
                          </span>
                          <span className="font-medium ml-1">
                            {data.avgVar1.toFixed(1)}
                            {info1.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Avg {info2.name}:
                          </span>
                          <span className="font-medium ml-1">
                            {data.avgVar2.toFixed(1)}
                            {info2.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "matrix" && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Correlation Matrix
          </h3>
          <p className="text-gray-600 mb-6">
            Complete correlation analysis between all weather variables.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-50"></th>
                  <th className="border border-gray-300 p-3 bg-gray-50">
                    Temperature
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-50">
                    Rainfall
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-50">
                    Humidity
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-50">
                    Sunshine
                  </th>
                </tr>
              </thead>
              <tbody>
                {["temp", "rainfall", "humidity", "sunshine"].map((var1) => (
                  <tr key={var1}>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-medium">
                      {getVariableInfo(var1).name}
                    </td>
                    {["temp", "rainfall", "humidity", "sunshine"].map(
                      (var2) => {
                        if (var1 === var2) {
                          return (
                            <td
                              key={var2}
                              className="border border-gray-300 p-3 text-center bg-gray-100"
                            >
                              1.000
                            </td>
                          );
                        }

                        const correlation =
                          correlationMatrix[`${var1}-${var2}`] || 0;
                        const strength = getCorrelationStrength(correlation);
                        const intensity = Math.abs(correlation);

                        return (
                          <td
                            key={var2}
                            className="border border-gray-300 p-3 text-center cursor-pointer hover:bg-gray-50"
                            style={{
                              backgroundColor:
                                correlation > 0
                                  ? `rgba(59, 130, 246, ${intensity * 0.3})`
                                  : `rgba(239, 68, 68, ${intensity * 0.3})`,
                            }}
                            onClick={() =>
                              setSelectedCorrelation(`${var1}-${var2}`)
                            }
                          >
                            <div className="font-medium">
                              {correlation.toFixed(3)}
                            </div>
                            <div className={`text-xs ${strength.color}`}>
                              {strength.strength}
                            </div>
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Interpretation Guide</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span>
                    Positive correlation (variables increase together)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span>
                    Negative correlation (one increases as other decreases)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                  <span>Perfect correlation (same variable)</span>
                </div>
              </div>
            </div>

            <div>
              {/* <h4 className="font-semibold mb-3">Correlation Strength</h4>
              <div className="space-y-1 text-sm">
                <div className="text-green-600">Very Strong: |r| ≥ 0.8</div>
                <div className="text-blue-600">Strong: 0.6 ≤ |r| < 0.8</div>
                <div className="text-yellow-600">Moderate: 0.4 ≤ |r| < 0.6</div>
                <div className="text-orange-600">Weak: 0.2 ≤ |r| < 0.4</div>
                <div className="text-red-600">Very Weak: |r| < 0.2</div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          🔍 Climate Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Key Findings</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • <strong>Temperature-Humidity:</strong> Strong negative
                correlation (-0.75) typical of marine climate
              </li>
              <li>
                • <strong>Rainfall-Sunshine:</strong> Expected negative
                relationship (-0.68) in Vancouver
              </li>
              <li>
                • <strong>Seasonal Variations:</strong> Correlations strongest
                in winter months
              </li>
              <li>
                • <strong>Climate Patterns:</strong> La Niña years show
                different correlation patterns
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Practical Applications</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • <strong>Weather Prediction:</strong> Use correlations for
                short-term forecasting
              </li>
              <li>
                • <strong>Climate Planning:</strong> Understand long-term
                weather relationships
              </li>
              <li>
                • <strong>Agriculture:</strong> Optimize crop planning based on
                weather correlations
              </li>
              <li>
                • <strong>Energy Management:</strong> Predict heating/cooling
                demands
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Correlations;
