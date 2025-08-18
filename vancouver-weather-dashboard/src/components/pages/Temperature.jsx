// components/pages/Temperature.jsx
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
} from "recharts";

/**
 * Temperature Analysis Page Component
 * Comprehensive temperature visualization and analysis for Vancouver weather data
 */
const Temperature = ({ data, yearlyData, selectedYear, availableYears }) => {
  // Calculate temperature statistics
  const temperatureStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const temperatures = data
      .map((d) => d.temp)
      .filter((t) => t !== null && t !== undefined);
    const maxTemps = data
      .map((d) => d.tempMax)
      .filter((t) => t !== null && t !== undefined);
    const minTemps = data
      .map((d) => d.tempMin)
      .filter((t) => t !== null && t !== undefined);

    const maxTemp = Math.max(...maxTemps);
    const minTemp = Math.min(...minTemps);
    const avgTemp =
      temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length;

    const hottestMonth = data.find((d) => d.tempMax === maxTemp);
    const coldestMonth = data.find((d) => d.tempMin === minTemp);

    return {
      average: avgTemp,
      max: maxTemp,
      min: minTemp,
      range: maxTemp - minTemp,
      hottestMonth: hottestMonth?.month,
      coldestMonth: coldestMonth?.month,
      seasonalVariation: calculateSeasonalVariation(data),
    };
  }, [data]);

  // Calculate year-over-year temperature trends
  const temperatureTrends = useMemo(() => {
    if (!yearlyData || yearlyData.length === 0) return [];

    const yearlyAverages = {};
    yearlyData.forEach((record) => {
      if (!yearlyAverages[record.year]) {
        yearlyAverages[record.year] = { temps: [], year: record.year };
      }
      yearlyAverages[record.year].temps.push(record.temp);
    });

    return Object.values(yearlyAverages)
      .map((yearData) => ({
        year: yearData.year,
        avgTemp:
          yearData.temps.reduce((sum, t) => sum + t, 0) / yearData.temps.length,
        climatePattern:
          yearlyData.find((d) => d.year === yearData.year)?.climatePattern ||
          "Normal",
      }))
      .sort((a, b) => a.year - b.year);
  }, [yearlyData]);

  // Custom tooltip for temperature charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${
                entry.dataKey === "tempMax"
                  ? "Max"
                  : entry.dataKey === "tempMin"
                  ? "Min"
                  : entry.dataKey === "temp"
                  ? "Average"
                  : entry.dataKey
              }: ${entry.value.toFixed(1)}°C`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No temperature data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Temperature Analysis
        </h2>
        <p className="text-gray-600">
          {selectedYear === "all"
            ? "Five-year average (2020-2024) showing Vancouver's seasonal temperature patterns"
            : `Detailed temperature analysis for ${selectedYear}`}
        </p>
        {temperatureStats && (
          <div className="mt-4 text-sm text-gray-500">
            Range: {temperatureStats.min.toFixed(1)}°C to{" "}
            {temperatureStats.max.toFixed(1)}°C • Annual Average:{" "}
            {temperatureStats.average.toFixed(1)}°C
          </div>
        )}
      </div>

      {/* Temperature Statistics Cards */}
      {temperatureStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hottest Month</p>
                <p className="text-lg font-bold text-gray-800">
                  {temperatureStats.hottestMonth}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  {temperatureStats.max.toFixed(1)}°C
                </p>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coldest Month</p>
                <p className="text-lg font-bold text-gray-800">
                  {temperatureStats.coldestMonth}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {temperatureStats.min.toFixed(1)}°C
                </p>
              </div>
              <div className="text-2xl">❄️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Average</p>
                <p className="text-lg font-bold text-gray-800">
                  {temperatureStats.average.toFixed(1)}°C
                </p>
                <p className="text-sm text-yellow-600 font-medium">
                  Climate Normal
                </p>
              </div>
              <div className="text-2xl">🌡️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temperature Range</p>
                <p className="text-lg font-bold text-gray-800">
                  {temperatureStats.range.toFixed(1)}°C
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  Seasonal Variation
                </p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Temperature Chart */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Monthly Temperature Profile
        </h3>
        <p className="text-gray-600 mb-6">
          Average, minimum, and maximum temperatures showing Vancouver's mild
          coastal climate
        </p>
        <ResponsiveContainer width="100%" height={400}>
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

            {/* Temperature range area */}
            <Area
              type="monotone"
              dataKey="tempMax"
              stroke="none"
              fill="#FEE2E2"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="tempMin"
              stroke="none"
              fill="#FFFFFF"
              fillOpacity={1}
            />

            {/* Temperature lines */}
            <Line
              type="monotone"
              dataKey="tempMax"
              stroke="#DC2626"
              strokeWidth={3}
              name="Maximum Temperature"
              dot={{ fill: "#DC2626", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#F59E0B"
              strokeWidth={4}
              name="Average Temperature"
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              stroke="#2563EB"
              strokeWidth={3}
              name="Minimum Temperature"
              dot={{ fill: "#2563EB", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature Range Visualization */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Monthly Temperature Range
        </h3>
        <p className="text-gray-600 mb-6">
          Daily temperature variation throughout the year - shows Vancouver's
          moderate climate
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="tempMin"
              fill="#2563EB"
              name="Minimum Temperature"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="tempMax"
              fill="#DC2626"
              name="Maximum Temperature"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Year-over-Year Temperature Trends */}
      {selectedYear === "all" && temperatureTrends.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            5-Year Temperature Trends
          </h3>
          <p className="text-gray-600 mb-6">
            Annual average temperatures showing climate variability and patterns
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                type="number"
                scale="point"
                domain={["dataMin", "dataMax"]}
              />
              <YAxis
                label={{
                  value: "Average Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tick={{ fontSize: 12 }}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">{label}</p>
                        <p className="text-orange-600">
                          Average: {payload[0].value.toFixed(1)}°C
                        </p>
                        <p className="text-sm text-gray-600">
                          Climate Pattern: {data.climatePattern}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="avgTemp"
                stroke="#F59E0B"
                strokeWidth={4}
                name="Annual Average"
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Climate Pattern Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>La Niña (cooler)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>El Niño (warmer)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Heat Dome (extreme)</span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Monthly Analysis */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Seasonal Temperature Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              season: "Winter",
              months: ["Dec", "Jan", "Feb"],
              color: "blue",
              icon: "❄️",
            },
            {
              season: "Spring",
              months: ["Mar", "Apr", "May"],
              color: "green",
              icon: "🌸",
            },
            {
              season: "Summer",
              months: ["Jun", "Jul", "Aug"],
              color: "red",
              icon: "☀️",
            },
            {
              season: "Fall",
              months: ["Sep", "Oct", "Nov"],
              color: "orange",
              icon: "🍂",
            },
          ].map((season, index) => {
            const seasonData = data.filter((d) =>
              season.months.includes(d.month)
            );
            const avgTemp =
              seasonData.reduce((sum, d) => sum + d.temp, 0) /
              seasonData.length;
            const maxTemp = Math.max(...seasonData.map((d) => d.tempMax));
            const minTemp = Math.min(...seasonData.map((d) => d.tempMin));

            return (
              <div
                key={index}
                className={`bg-${season.color}-50 rounded-lg p-4 border border-${season.color}-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {season.season}
                  </h4>
                  <span className="text-2xl">{season.icon}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-medium">{avgTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium">
                      {minTemp.toFixed(1)}° - {maxTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {season.months.join(", ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Climate Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span>🌡️</span>
          Climate Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Vancouver's Temperature Characteristics
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mild oceanic climate with small seasonal variation</li>
              <li>• Winter temperatures rarely below freezing</li>
              <li>• Summer highs typically 20-25°C</li>
              <li>• Heat dome events can push temperatures above 30°C</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Climate Pattern Effects
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• La Niña: Cooler, wetter winters</li>
              <li>• El Niño: Warmer, drier winters</li>
              <li>• Heat domes: Extreme summer temperatures</li>
              <li>• Arctic outflows: Rare cold snaps in winter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate seasonal variation
const calculateSeasonalVariation = (data) => {
  const winter = data.filter((d) => ["Dec", "Jan", "Feb"].includes(d.month));
  const summer = data.filter((d) => ["Jun", "Jul", "Aug"].includes(d.month));

  const winterAvg = winter.reduce((sum, d) => sum + d.temp, 0) / winter.length;
  const summerAvg = summer.reduce((sum, d) => sum + d.temp, 0) / summer.length;

  return summerAvg - winterAvg;
};

export default Temperature;
