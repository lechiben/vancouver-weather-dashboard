// components/common/MetricCard.jsx
import React from "react";

/**
 * MetricCard Component
 * Professional metric display card with trends, comparisons, and visual indicators
 */
const MetricCard = ({
  label,
  value,
  icon,
  color = "blue",
  subtitle,
  trend,
  comparison,
  loading = false,
  onClick,
  className = "",
}) => {
  // Color theme mappings
  const colorThemes = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      trend: {
        up: "text-green-600 bg-green-100",
        down: "text-red-600 bg-red-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      trend: {
        up: "text-green-600 bg-green-100",
        down: "text-blue-600 bg-blue-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      icon: "text-cyan-600",
      trend: {
        up: "text-red-600 bg-red-100",
        down: "text-green-600 bg-green-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      trend: {
        up: "text-green-600 bg-green-100",
        down: "text-orange-600 bg-orange-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      trend: {
        up: "text-green-600 bg-green-100",
        down: "text-red-600 bg-red-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      trend: {
        up: "text-green-600 bg-green-100",
        down: "text-red-600 bg-red-100",
        stable: "text-gray-600 bg-gray-100",
      },
    },
  };

  const theme = colorThemes[color] || colorThemes.blue;

  /**
   * Get trend icon based on trend direction
   */
  const getTrendIcon = (trendDirection) => {
    switch (trendDirection) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "➡️";
      default:
        return "";
    }
  };

  /**
   * Get trend description
   */
  const getTrendDescription = (trendDirection) => {
    switch (trendDirection) {
      case "up":
        return "Increasing";
      case "down":
        return "Decreasing";
      case "stable":
        return "Stable";
      default:
        return "";
    }
  };

  /**
   * Format comparison value for display
   */
  const formatComparison = (comparisonValue, currentValue) => {
    if (!comparisonValue || !currentValue) return null;

    const current = parseFloat(currentValue.replace(/[^\d.-]/g, ""));
    const baseline = parseFloat(comparisonValue);

    if (isNaN(current) || isNaN(baseline)) return null;

    const difference = current - baseline;
    const percentChange = ((difference / baseline) * 100).toFixed(1);

    return {
      difference: difference.toFixed(1),
      percentChange,
      isPositive: difference > 0,
      isSignificant: Math.abs(difference) > baseline * 0.05, // 5% threshold
    };
  };

  const comparisonData = comparison
    ? formatComparison(comparison, value)
    : null;

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg p-6 shadow-md border ${theme.bg} ${className}`}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-lg p-6 shadow-md border transition-all duration-200 
        hover:shadow-lg hover:scale-105 cursor-pointer
        ${theme.border} ${onClick ? "hover:border-opacity-60" : ""} ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">
            {label}
          </p>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900 mb-1 break-words">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {subtitle}
            </p>
          )}

          {/* Trend Indicator */}
          {trend && (
            <div
              className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${theme.trend[trend]}
            `}
            >
              <span className="mr-1">{getTrendIcon(trend)}</span>
              {getTrendDescription(trend)}
            </div>
          )}

          {/* Comparison */}
          {comparisonData && (
            <div className="mt-2 text-xs">
              <span className="text-gray-500">vs baseline: </span>
              <span
                className={`font-medium ${
                  comparisonData.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {comparisonData.isPositive ? "+" : ""}
                {comparisonData.difference} ({comparisonData.percentChange}%)
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0 ml-4">
          <div
            className={`
            w-12 h-12 rounded-full flex items-center justify-center text-2xl
            ${theme.bg}
          `}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MetricCardGrid Component
 * Grid container for multiple metric cards with responsive layout
 */
export const MetricCardGrid = ({ children, columns = 4, className = "" }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * CompactMetricCard Component
 * Smaller version for dashboard sidebars or dense layouts
 */
export const CompactMetricCard = ({
  label,
  value,
  icon,
  color = "blue",
  trend,
  className = "",
}) => {
  const colorThemes = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    cyan: "text-cyan-600 bg-cyan-50",
    yellow: "text-yellow-600 bg-yellow-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-600 truncate">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${colorThemes[color]}`}
        >
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center">
          <span className="text-xs text-gray-500">
            {trend === "up" ? "↗️" : trend === "down" ? "↘️" : "➡️"}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * MetricCardSkeleton Component
 * Loading skeleton for metric cards
 */
export const MetricCardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-md border border-gray-200 ${className}`}
    >
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * AnimatedMetricCard Component
 * Metric card with number animation effects
 */
export const AnimatedMetricCard = ({
  label,
  value,
  icon,
  color = "blue",
  animationDuration = 1000,
  ...props
}) => {
  const [displayValue, setDisplayValue] = React.useState("0");

  React.useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    const unit = value.replace(/[\d.-]/g, "");

    if (!isNaN(numericValue)) {
      const increment = numericValue / (animationDuration / 50);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current) + unit);
        }
      }, 50);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animationDuration]);

  return (
    <MetricCard
      {...props}
      label={label}
      value={displayValue}
      icon={icon}
      color={color}
    />
  );
};

export default MetricCard;
