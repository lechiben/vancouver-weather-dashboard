// components/common/Navigation.jsx
import React from "react";
import { TABS } from "../../utils/constants.js";

/**
 * Navigation Component
 * Handles tab navigation and year filtering
 */
const Navigation = ({
  activeTab,
  onTabChange,
  selectedYear,
  onYearChange,
  availableYears = [2020, 2021, 2022, 2023, 2024],
  showYearFilter = true,
}) => {
  const tabs = [
    {
      id: TABS.OVERVIEW,
      label: "Overview",
      icon: "📊",
      description: "Key metrics and monthly patterns",
    },
    {
      id: TABS.TEMPERATURE,
      label: "Temperature",
      icon: "🌡️",
      description: "Detailed temperature analysis",
    },
    {
      id: TABS.TRENDS,
      label: "Trends",
      icon: "📈",
      description: "Multi-year patterns and changes",
    },
    {
      id: TABS.CORRELATIONS,
      label: "Correlations",
      icon: "🔗",
      description: "Variable relationships and insights",
    },
  ];

  const yearOptions = [
    {
      value: "all",
      label: "All Years (Average)",
      description: "Climate normal patterns",
    },
    ...availableYears.map((year) => ({
      value: year.toString(),
      label: year.toString(),
      description: getYearDescription(year),
    })),
  ];

  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group relative px-4 py-2 rounded-lg font-medium transition-all duration-200
                flex items-center gap-2 min-w-fit
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
              title={tab.description}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {tab.description}
              </div>
            </button>
          ))}
        </div>

        {/* Year Filter */}
        {showYearFilter && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              📅 Time Period:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="
                px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-white shadow-sm min-w-fit
              "
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Year Description */}
            <div className="hidden lg:block text-xs text-gray-500 max-w-xs">
              {
                yearOptions.find((opt) => opt.value === selectedYear)
                  ?.description
              }
            </div>
          </div>
        )}
      </div>

      {/* Mobile Year Description */}
      {showYearFilter && (
        <div className="lg:hidden mt-2 text-xs text-gray-500 text-center">
          {yearOptions.find((opt) => opt.value === selectedYear)?.description}
        </div>
      )}

      {/* Active Tab Indicator */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Current View:</span>
            <span className="flex items-center gap-1">
              {tabs.find((tab) => tab.id === activeTab)?.icon}
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => window.print()}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Print Dashboard"
            >
              🖨️ Print
            </button>
            <button
              onClick={() =>
                navigator.share?.({
                  title: "Vancouver Weather Dashboard",
                  url: window.location.href,
                })
              }
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Share Dashboard"
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Get description for each year based on climate patterns
 */
const getYearDescription = (year) => {
  const descriptions = {
    2020: "La Niña year - cooler, wetter conditions",
    2021: "Heat dome year - record temperatures",
    2022: "Strong La Niña - atmospheric rivers",
    2023: "El Niño transition - variable patterns",
    2024: "Mild El Niño - warmer winter",
  };

  return descriptions[year] || "Weather data available";
};

export default Navigation;
