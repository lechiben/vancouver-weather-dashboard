// components/common/Header.jsx
import React from "react";

/**
 * Header Component
 * Displays the main title, subtitle, and station information
 */
const Header = ({
  title,
  subtitle,
  stationInfo,
  lastUpdated,
  showLiveIndicator = true,
}) => {
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Real-time ready";

    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-CA", {
        timeZone: "America/Vancouver",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data current";
    }
  };

  return (
    <header className="text-center mb-8">
      {/* Main Title */}
      <div className="mb-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Station Info & Status */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Station Information */}
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-1">
              Weather Station
            </h3>
            {stationInfo ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{stationInfo.name}</p>
                <p>ID: {stationInfo.id}</p>
                <p>
                  {stationInfo.coordinates?.lat?.toFixed(4)}°N,{" "}
                  {stationInfo.coordinates?.lng?.toFixed(4)}°W
                </p>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="font-medium">Vancouver International Airport</p>
                <p>Environment Canada Station</p>
                <p>49.1939°N, 123.1844°W</p>
              </div>
            )}
          </div>

          {/* Live Status Indicator */}
          <div className="text-center">
            {showLiveIndicator && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Ready</span>
              </div>
            )}

            <div className="mt-2 text-xs text-gray-500">
              API Integration Ready
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-right">
            <h3 className="font-semibold text-gray-800 mb-1">Data Status</h3>
            <div className="text-sm text-gray-600">
              <p>{formatLastUpdated(lastUpdated)}</p>
              <p className="text-xs mt-1">Vancouver Time (PDT/PST)</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Temperature Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Climate Patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Extreme Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Trend Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Climate Context Banner */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
        <p className="text-sm text-blue-800">
          <span className="font-medium">🌍 Climate Context:</span> Vancouver's
          oceanic climate features mild, wet winters and warm, dry summers.
          Recent years show increasing extreme weather events including heat
          domes and atmospheric rivers.
        </p>
      </div>
    </header>
  );
};

export default Header;
