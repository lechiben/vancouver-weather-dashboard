// App.jsx
import React, { useState } from "react";
import { useWeatherData } from "./hooks/useWeatherData.js";
import { useDataFiltering } from "./hooks/useDataFiltering.js";
import Header from "./components/common/Header.jsx";
import Navigation from "./components/common/Navigation.jsx";
import MetricCard from "./components/common/MetricCard.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import Footer from "./components/common/Footer.jsx";
import Overview from "./components/pages/Overview.jsx";
import Temperature from "./components/pages/Temperature.jsx";
import Trends from "./components/pages/Trends.jsx";
import Correlations from "./components/pages/Correlations.jsx";
import { TABS, VANCOUVER_CLIMATE_NORMALS } from "./utils/constants.js";
import {
  calculateTemperatureStats,
  calculateRainfallStats,
} from "./utils/calculations.js";

/**
 * Main Application Component
 * Orchestrates the entire Vancouver Weather Dashboard
 */
const App = () => {
  // State management
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [selectedYear, setSelectedYear] = useState("all");

  // Custom hooks for data management
  const { data, loading, error, refreshData, stationInfo } = useWeatherData({
    useSampleData: true, // Toggle for development
  });

  const { getFilteredData, getAvailableYears } = useDataFiltering(data);

  // Get filtered data based on current selections
  const filteredData = getFilteredData(selectedYear);
  const availableYears = getAvailableYears();

  // Calculate key metrics
  const temperatureStats = calculateTemperatureStats(filteredData);
  const rainfallStats = calculateRainfallStats(filteredData);

  // Prepare metric cards data
  const metricCards = [
    {
      label: "Annual Rainfall",
      value: rainfallStats ? `${Math.round(rainfallStats.total)}mm` : "N/A",
      icon: "🌧️",
      color: "blue",
      comparison: VANCOUVER_CLIMATE_NORMALS.ANNUAL_RAINFALL,
    },
    {
      label: "Avg Temperature",
      value: temperatureStats
        ? `${temperatureStats.average.toFixed(1)}°C`
        : "N/A",
      icon: "🌡️",
      color: "orange",
      comparison: VANCOUVER_CLIMATE_NORMALS.AVERAGE_TEMPERATURE,
    },
    {
      label: "Avg Humidity",
      value:
        filteredData.length > 0
          ? `${Math.round(
              filteredData.reduce((sum, d) => sum + d.humidity, 0) /
                filteredData.length
            )}%`
          : "N/A",
      icon: "💧",
      color: "cyan",
      comparison: VANCOUVER_CLIMATE_NORMALS.AVERAGE_HUMIDITY,
    },
    {
      label: "Sunshine Hours",
      value:
        filteredData.length > 0
          ? `${Math.round(
              filteredData.reduce((sum, d) => sum + d.sunshine, 0)
            )}hrs`
          : "N/A",
      icon: "☀️",
      color: "yellow",
      comparison: VANCOUVER_CLIMATE_NORMALS.ANNUAL_SUNSHINE,
    },
  ];

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle year filter changes
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Data Loading Error
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <LoadingSpinner message="Loading Vancouver weather data..." />
        </div>
      </div>
    );
  }

  // Render page content based on active tab
  const renderPageContent = () => {
    const pageProps = {
      data: filteredData,
      yearlyData: data.yearly,
      selectedYear,
      availableYears,
    };

    switch (activeTab) {
      case TABS.TEMPERATURE:
        return <Temperature {...pageProps} />;
      case TABS.TRENDS:
        return <Trends {...pageProps} />;
      case TABS.CORRELATIONS:
        return <Correlations {...pageProps} />;
      case TABS.OVERVIEW:
      default:
        return <Overview {...pageProps} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header Section */}
        <Header
          title="Vancouver Weather Analytics Dashboard"
          subtitle="Comprehensive climate data visualization for Vancouver, BC"
          stationInfo={stationInfo}
          lastUpdated={data.metadata?.lastUpdated}
        />

        {/* Navigation and Controls */}
        <div className="mb-8">
          <Navigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            availableYears={availableYears}
          />
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((metric, index) => (
            <MetricCard
              key={index}
              {...metric}
              trend={selectedYear !== "all" ? "stable" : "up"} // Could calculate real trends
            />
          ))}
        </div>

        {/* Main Content Area */}
        <main className="mb-8">{renderPageContent()}</main>

        {/* Footer */}
        <Footer
          dataSource="Environment and Climate Change Canada"
          techStack="React, Recharts, Tailwind CSS"
          onRefresh={refreshData}
          cacheInfo={data.metadata}
        />
      </div>
    </div>
  );
};

export default App;
