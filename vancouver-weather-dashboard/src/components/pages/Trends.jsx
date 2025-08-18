// components/pages/Trends.jsx
import React, { useMemo } from "react";
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
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  calculateYearlyAggregates,
  calculateMovingAverage,
  detectAnomalies,
} from "../../utils/calculations.js";
import { CHART_COLORS } from "../../utils/constants.js";
import CustomTooltip from "../charts/CustomTooltip.jsx";

/**
 * Trends Page Component
 * Shows year-over-year climate trends, climate pattern analysis, and long-term changes
 */
const Trends = ({ data, yearlyData, selectedYear, availableYears }) => {
  // Calculate trend data
  const trendData = useMemo(() => {
    if (!yearlyData || yearlyData.length === 0)
      return { yearly: [], anomalies: [], patterns: [] };

    const yearlyAggregates = calculateYearlyAggregates(yearlyData);
    const temperatureAnomalies = detectAnomalies(yearlyData, "temp", 1.5);
    const rainfallAnomalies = detectAnomalies(yearlyData, "rainfall", 1.8);

    // Calculate climate patterns
    const patterns = yearlyAggregates.map((year) => {
      const yearData = yearlyData.filter((d) => d.year === year.year);
      const pattern = yearData[0]?.climatePattern || "Normal";
      const extremeEvents = yearData
        .filter((d) => d.extremeEvent)
        .map((d) => d.extremeEvent);

      return {
        ...year,
        climatePattern: pattern,
        extremeEvents: [...new Set(extremeEvents)],
        tempAnomaly: year.avgTemp - 11.1, // Deviation from climate normal
        rainAnomaly: year.totalRainfall - 1219, // Deviation from climate normal
      };
    });

    return {
      yearly: yearlyAggregates,
      anomalies: {
        temperature: temperatureAnomalies,
        rainfall: rainfallAnomalies,
      },
      patterns,
    };
  }, [yearlyData]);

  // Calculate seasonal trends
  const seasonalTrends = useMemo(() => {
    if (!yearlyData || yearlyData.length === 0) return [];

    const seasons = {
      Winter: [11, 0, 1], // Dec, Jan, Feb
      Spring: [2, 3, 4], // Mar, Apr, May
      Summer: [5, 6, 7], // Jun, Jul, Aug
      Fall: [8, 9, 10], // Sep, Oct, Nov
    };

    const years = [...new Set(yearlyData.map((d) => d.year))].sort();

    return years.map((year) => {
      const yearData = yearlyData.filter((d) => d.year === year);
      const seasonData = {};

      Object.entries(seasons).forEach(([season, months]) => {
        const seasonMonths = yearData.filter((d) =>
          months.includes(d.monthIndex)
        );
        if (seasonMonths.length > 0) {
          seasonData[season] = {
            temp:
              seasonMonths.reduce((sum, d) => sum + d.temp, 0) /
              seasonMonths.length,
            rainfall: seasonMonths.reduce((sum, d) => sum + d.rainfall, 0),
          };
        }
      });

      return {
        year,
        ...seasonData,
      };
    });
  }, [yearlyData]);

  // Get climate pattern distribution
  const climatePatternStats = useMemo(() => {
    if (!trendData.patterns) return [];

    const patternCounts = {};
    trendData.patterns.forEach((p) => {
      const pattern = p.climatePattern;
      if (!patternCounts[pattern]) {
        patternCounts[pattern] = { count: 0, years: [] };
      }
      patternCounts[pattern].count++;
      patternCounts[pattern].years.push(p.year);
    });

    return Object.entries(patternCounts).map(([pattern, data]) => ({
      pattern,
      ...data,
    }));
  }, [trendData.patterns]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Climate Trends Analysis
        </h2>
        <p className="text-gray-600">
          Long-term climate patterns, year-over-year comparisons, and trend
          analysis for Vancouver. Data shows the impact of climate oscillations
          like El Niño and La Niña on local weather patterns.
        </p>
      </div>

      {/* Annual Overview Comparison */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Annual Climate Summary (2020-2024)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Trends */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Annual Average Temperature
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData.yearly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="avgTemp"
                  fill={CHART_COLORS.temperature}
                  opacity={0.8}
                />
                <Line
                  type="monotone"
                  dataKey="avgTemp"
                  stroke={CHART_COLORS.temperatureMax}
                  strokeWidth={3}
                  dot={{
                    fill: CHART_COLORS.temperatureMax,
                    strokeWidth: 2,
                    r: 4,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall Trends */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Annual Total Rainfall
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData.yearly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Rainfall (mm)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalRainfall"
                  fill={CHART_COLORS.rainfall}
                  opacity={0.8}
                />
                <Line
                  type="monotone"
                  dataKey="totalRainfall"
                  stroke={CHART_COLORS.temperatureMin}
                  strokeWidth={3}
                  dot={{
                    fill: CHART_COLORS.temperatureMin,
                    strokeWidth: 2,
                    r: 4,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Climate Anomalies */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Climate Anomalies & Patterns
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Anomalies */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Temperature Anomalies
            </h4>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Deviation from 1981-2010 climate normal (11.1°C)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData.patterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Anomaly (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p style={{ color: payload[0].color }}>
                            Anomaly: {payload[0].value > 0 ? "+" : ""}
                            {payload[0].value.toFixed(1)}°C
                          </p>
                          <p className="text-sm text-gray-600">
                            Pattern: {data.climatePattern}
                          </p>
                          {data.extremeEvents.length > 0 && (
                            <p className="text-sm text-orange-600">
                              Events: {data.extremeEvents.join(", ")}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="tempAnomaly"
                  fill={(entry) =>
                    entry.tempAnomaly > 0 ? "#EF4444" : "#3B82F6"
                  }
                  name="Temperature Anomaly"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Climate Pattern Timeline */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Climate Patterns
            </h4>
            <div className="space-y-3">
              {trendData.patterns.map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        pattern.climatePattern.includes("La Niña")
                          ? "bg-blue-500"
                          : pattern.climatePattern.includes("El Niño")
                          ? "bg-red-500"
                          : pattern.climatePattern.includes("Heat Dome")
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {pattern.year}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pattern.climatePattern}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {pattern.tempAnomaly > 0 ? "+" : ""}
                      {pattern.tempAnomaly.toFixed(1)}°C
                    </p>
                    <p className="text-xs text-gray-500">
                      {pattern.rainAnomaly > 0 ? "+" : ""}
                      {pattern.rainAnomaly}mm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Seasonal Climate Trends
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seasonal Temperature Trends */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Seasonal Temperature Changes
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Winter.temp"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Winter"
                />
                <Line
                  type="monotone"
                  dataKey="Spring.temp"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Spring"
                />
                <Line
                  type="monotone"
                  dataKey="Summer.temp"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Summer"
                />
                <Line
                  type="monotone"
                  dataKey="Fall.temp"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Fall"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Progression Over Years */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">
              Long-term Temperature Progression
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Temperature (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke={CHART_COLORS.temperature}
                  fill={CHART_COLORS.temperature}
                  fillOpacity={0.3}
                  name="Temperature"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Key Climate Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Warming Trend */}
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <h4 className="font-semibold text-red-800">Warming Trend</h4>
            </div>
            <p className="text-sm text-red-700">
              Average temperature increased by{" "}
              {trendData.patterns.length > 0
                ? (
                    trendData.patterns[trendData.patterns.length - 1]?.avgTemp -
                    trendData.patterns[0]?.avgTemp
                  ).toFixed(1)
                : "0.8"}
              °C from 2020 to 2024, with 2021 showing extreme heat dome effects.
            </p>
          </div>

          {/* Precipitation Variability */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <h4 className="font-semibold text-blue-800">
                Precipitation Patterns
              </h4>
            </div>
            <p className="text-sm text-blue-700">
              La Niña years (2020, 2022) showed increased rainfall, while El
              Niño transition (2023-2024) brought more moderate precipitation
              patterns.
            </p>
          </div>

          {/* Extreme Events */}
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <h4 className="font-semibold text-orange-800">Extreme Events</h4>
            </div>
            <p className="text-sm text-orange-700">
              Notable events include 2021 heat dome (June), 2022 atmospheric
              rivers (November), and 2024 arctic outflow events (January).
            </p>
          </div>
        </div>
      </div>

      {/* Climate Context */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          Climate Science Context
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              ENSO Effects on Vancouver
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <strong>La Niña:</strong> Cooler, wetter winters; increased
                atmospheric river activity
              </li>
              <li>
                • <strong>El Niño:</strong> Warmer, drier winters; reduced
                snowpack in mountains
              </li>
              <li>
                • <strong>Neutral:</strong> Near-normal precipitation and
                temperature patterns
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Regional Climate Impacts
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <strong>Urban Heat Island:</strong> City temperatures 2-4°C
                warmer than rural areas
              </li>
              <li>
                • <strong>Coastal Influence:</strong> Maritime climate moderates
                temperature extremes
              </li>
              <li>
                • <strong>Orographic Effects:</strong> North Shore mountains
                enhance precipitation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
