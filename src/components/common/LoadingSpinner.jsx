// components/common/LoadingSpinner.jsx
import React from "react";

/**
 * Loading Spinner Component with Weather Theme
 * Provides various loading states with appropriate messaging
 */
const LoadingSpinner = ({
  message = "Loading data...",
  size = "medium",
  type = "weather",
  showProgress = false,
  progress = 0,
}) => {
  const getSizeClasses = (size) => {
    switch (size) {
      case "small":
        return "h-6 w-6 border-2";
      case "large":
        return "h-16 w-16 border-4";
      case "extra-large":
        return "h-24 w-24 border-6";
      case "medium":
      default:
        return "h-12 w-12 border-4";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "weather":
        return "🌤️";
      case "data":
        return "📊";
      case "api":
        return "🔄";
      case "error":
        return "⚠️";
      default:
        return "⏳";
    }
  };

  const sizeClasses = getSizeClasses(size);
  const icon = getTypeIcon(type);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Main Spinner */}
      <div className="relative mb-6">
        {/* Outer Ring */}
        <div
          className={`${sizeClasses} border-gray-200 rounded-full animate-spin`}
        >
          <div
            className={`${sizeClasses} border-blue-500 border-t-transparent rounded-full animate-spin`}
          ></div>
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">{icon}</span>
        </div>

        {/* Weather Animation Overlay */}
        {type === "weather" && (
          <div className="absolute -top-2 -right-2">
            <div className="animate-bounce">
              <span className="text-xs">☁️</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading Message */}
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
          </div>
        )}

        {/* Contextual Sub-message */}
        <p className="text-sm text-gray-600">
          {getContextualMessage(type, message)}
        </p>
      </div>

      {/* Loading Dots Animation */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

/**
 * Get contextual loading message based on type
 */
const getContextualMessage = (type, message) => {
  if (message.includes("weather")) {
    return "Fetching latest meteorological data from Environment Canada...";
  }
  if (message.includes("data")) {
    return "Processing climate statistics and generating visualizations...";
  }
  if (type === "api") {
    return "Connecting to weather services and validating data...";
  }
  if (type === "error") {
    return "Attempting to resolve connection issues...";
  }
  return "Please wait while we prepare your dashboard...";
};

/**
 * Simple Loading Spinner - Minimal version
 */
export const SimpleSpinner = ({ size = "small" }) => {
  const sizeClasses =
    size === "small" ? "h-4 w-4 border-2" : "h-6 w-6 border-2";

  return (
    <div
      className={`${sizeClasses} border-gray-300 border-t-blue-500 rounded-full animate-spin`}
    ></div>
  );
};

/**
 * Inline Loading Spinner - For buttons and small spaces
 */
export const InlineSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center space-x-2">
      <SimpleSpinner size="small" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

/**
 * Page Loading Overlay - Full page loading state
 */
export const PageLoadingOverlay = ({
  message = "Loading Vancouver Weather Dashboard...",
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <LoadingSpinner
          message={message}
          size="large"
          type="weather"
          showProgress={false}
        />
      </div>
    </div>
  );
};

/**
 * Data Loading Skeleton - For content placeholders
 */
export const DataLoadingSkeleton = ({ rows = 3 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Chart Loading Placeholder - For chart components
 */
export const ChartLoadingPlaceholder = ({ height = 300 }) => {
  return (
    <div
      className="bg-gray-100 rounded-lg flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <LoadingSpinner
          message="Generating chart..."
          size="medium"
          type="data"
        />
      </div>
    </div>
  );
};

/**
 * Weather Station Loading - Specific to weather data
 */
export const WeatherStationLoading = ({ stationName = "Vancouver" }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg p-6">
      <LoadingSpinner
        message={`Connecting to ${stationName} weather station...`}
        size="medium"
        type="weather"
        showProgress={false}
      />
      <div className="mt-4 text-center">
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Temperature</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Precipitation</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>Sunshine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
