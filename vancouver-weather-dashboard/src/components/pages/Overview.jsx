// components/pages/Overview.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants.js";
import {
  calculateTemperatureStats,
  calculateRainfallStats,
} from "../../utils/calculations.js";
import CustomTooltip from "../charts/CustomTooltip.jsx";

/**
 * Overview Page Component
 * Provides a comprehensive dashboard overview of Vancouver weather patterns
 */
const Overview = ({ data, yearlyData, selectedYear, availableYears }) => {
  // Calculate key statistics
  const temperatureStats = calculateTemperatureStats(data);
  const rainfallStats = calculateRainfallStats(data);

  // Get seasonal summaries
  const getSeasonalData = () => {
    const seasons = {
      Winter: data.filter((d) => ["Dec", "Jan", "Feb"].includes(d.month)),
      Spring: data.filter((d) => ["Mar", "Apr", "May"].includes(d.month)),
      Summer: data.filter((d) => ["Jun", "Jul", "Aug"].includes(d.month)),
      Fall: data.filter((d) => ["Sep", "Oct", "Nov"].includes(d.month)),
    };

    return Object.entries(seasons).map(([season, seasonData]) => ({
      season,
      avgTemp:
        seasonData.reduce((sum, d) => sum + d.temp, 0) / seasonData.length,
      totalRainfall: seasonData.reduce((sum, d) => sum + d.rainfall, 0),
      avgHumidity:
        seasonData.reduce((sum, d) => sum + d.humidity, 0) / seasonData.length,
      totalSunshine: seasonData.reduce((sum, d) => sum + d.sunshine, 0),
    }));
  };

  const seasonalData = getSeasonalData();

  // Get extreme weather highlights
  const getWeatherHighlights = () => {
    if (!temperatureStats || !rainfallStats) return [];

    return [
      {
        title: "Hottest Month",
        value: `${temperatureStats.hottestMonth}`,
        detail: `${temperatureStats.max.toFixed(1)}°C`,
        icon: "🔥",
        color: "text-red-600",
      },
      {
        title: "Coldest Month",
        value: `${temperatureStats.coldestMonth}`,
        detail: `${temperatureStats.min.toFixed(1)}°C`,
        icon: "❄️",
        color: "text-blue-600",
      },
      {
        title: "Wettest Month",
        value: `${rainfallStats.wettest}`,
        detail: `${rainfallStats.max.toFixed(1)}mm`,
        icon: "🌧️",
        color: "text-blue-500",
      },
      {
        title: "Driest Month",
        value: `${rainfallStats.driest}`,
        detail: `${rainfallStats.min.toFixed(1)}mm`,
        icon: "☀️",
        color: "text-yellow-600",
      },
    ];
  };

  const weatherHighlights = getWeatherHighlights();

  // Climate pattern information
  const getClimateInfo = () => {
    if (selectedYear === "all") {
      return {
        title: "Multi-Year Climate Analysis",
        description:
          "Average patterns from 2020-2024 showing Vancouver's typical Pacific Northwest maritime climate.",
        pattern: "Marine West Coast Climate",
        characteristics: [
          "Mild, wet winters with most rainfall November-February",
          "Warm, dry summers with peak temperatures in July-August",
          "Moderate humidity year-round due to ocean influence",
          "Significant seasonal variation in daylight hours",
        ],
      };
    } else {
      const yearData = yearlyData?.find(
        (d) => d.year === parseInt(selectedYear)
      );
      const patterns = {
        2020: {
          pattern: "La Niña (Weak)",
          description: "Cooler than normal winter, wetter than average overall",
        },
        2021: {
          pattern: "Heat Dome Year",
          description:
            "Historic heat event in June, record-breaking temperatures",
        },
        2022: {
          pattern: "La Niña (Strong)",
          description:
            "Multiple atmospheric rivers, significant flooding events",
        },
        2023: {
          pattern: "El Niño Developing",
          description: "Transition year with variable weather patterns",
        },
        2024: {
          pattern: "El Niño (Weak)",
          description: "Warmer winter, drier than normal conditions",
        },
      };

      const info = patterns[selectedYear] || {
        pattern: "Normal Conditions",
        description: "Typical weather patterns",
      };

      return {
        title: `${selectedYear} Climate Overview`,
        description: info.description,
        pattern: info.pattern,
        extremeEvents: yearData?.extremeEvent ? [yearData.extremeEvent] : [],
      };
    }
  };

  const climateInfo = getClimateInfo();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No weather data available for overview</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Climate Overview Card */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {climateInfo.title}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-4">{climateInfo.description}</p>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                Climate Pattern
              </h4>
              <p className="text-blue-700">{climateInfo.pattern}</p>
              {climateInfo.extremeEvents &&
                climateInfo.extremeEvents.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-medium text-blue-800">
                      Notable Events:
                    </h5>
                    <ul className="text-blue-700 text-sm">
                      {climateInfo.extremeEvents.map((event, index) => (
                        <li key={index}>• {event}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
          <div>
            {climateInfo.characteristics && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Climate Characteristics
                </h4>
                <ul className="space-y-2">
                  {climateInfo.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-600 text-sm">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weatherHighlights.map((highlight, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-700">{highlight.title}</h4>
              <span className="text-2xl">{highlight.icon}</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{highlight.value}</p>
            <p className={`text-sm font-medium ${highlight.color}`}>
              {highlight.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Rainfall Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Monthly Rainfall Distribution
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {selectedYear === "all"
              ? "Average monthly rainfall showing Vancouver's wet winter, dry summer pattern"
              : `Monthly rainfall for ${selectedYear} compared to normal patterns`}
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                label={{
                  value: "Rainfall (mm)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="rainfall"
                fill={CHART_COLORS.rainfall}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Variation */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Temperature Variation
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Annual temperature cycle showing minimum, average, and maximum
            temperatures
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
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
                dataKey="tempMax"
                stroke={CHART_COLORS.temperatureMax}
                strokeWidth={2}
                name="Max Temperature"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke={CHART_COLORS.temperature}
                strokeWidth={3}
                name="Average Temperature"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="tempMin"
                stroke={CHART_COLORS.temperatureMin}
                strokeWidth={2}
                name="Min Temperature"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Patterns */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Humidity Patterns
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Monthly relative humidity showing seasonal variations and ocean
            influence
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                label={{
                  value: "Humidity (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[60, 90]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke={CHART_COLORS.humidity}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.humidity, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sunshine Hours */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Daily Sunshine Hours
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Average daily sunshine hours reflecting seasonal daylight variation
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                label={{ value: "Hours", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sunshine"
                fill={CHART_COLORS.sunshine}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Summary */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Seasonal Summary
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Quarterly weather patterns showing Vancouver's distinct seasonal
          characteristics
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalData.map((season, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                {season.season}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Temp:</span>
                  <span className="font-medium">
                    {season.avgTemp.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rain:</span>
                  <span className="font-medium">
                    {season.totalRainfall.toFixed(0)}mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Humidity:</span>
                  <span className="font-medium">
                    {season.avgHumidity.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sun:</span>
                  <span className="font-medium">
                    {season.totalSunshine.toFixed(1)}hrs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Climate Patterns
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                • Vancouver has a marine west coast climate with mild
                temperatures
              </li>
              <li>• Winter months (Nov-Feb) receive 75% of annual rainfall</li>
              <li>
                • Summer drought period typically lasts from June to September
              </li>
              <li>
                • Ocean proximity moderates temperature extremes year-round
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Weather Statistics
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                • Annual temperature range: {temperatureStats?.range.toFixed(1)}
                °C
              </li>
              <li>
                • Peak rainfall: {rainfallStats?.max.toFixed(0)}mm in{" "}
                {rainfallStats?.wettest}
              </li>
              <li>
                • Lowest rainfall: {rainfallStats?.min.toFixed(0)}mm in{" "}
                {rainfallStats?.driest}
              </li>
              <li>• Humidity remains high (65-85%) due to ocean influence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
