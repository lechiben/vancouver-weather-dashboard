// hooks/useDataFiltering.js
import { useMemo } from "react";

/**
 * Custom hook for filtering and manipulating weather data
 * @param {Object} data - Weather data object with monthly and yearly arrays
 * @returns {Object} Filtering functions and utilities
 */
export const useDataFiltering = (data) => {
  /**
   * Get filtered data based on selected year
   * @param {string|number} selectedYear - Year to filter by, or 'all' for monthly averages
   * @returns {Array} Filtered weather data
   */
  const getFilteredData = useMemo(() => {
    return (selectedYear) => {
      if (!data || (!data.monthly && !data.yearly)) {
        return [];
      }

      if (selectedYear === "all") {
        return data.monthly || [];
      }

      const year = parseInt(selectedYear);
      return (data.yearly || []).filter((d) => d.year === year);
    };
  }, [data]);

  /**
   * Get available years from the dataset
   * @returns {Array} Array of available years
   */
  const getAvailableYears = useMemo(() => {
    return () => {
      if (!data?.yearly) return [];

      const years = [...new Set(data.yearly.map((d) => d.year))];
      return years.sort((a, b) => b - a); // Sort descending (newest first)
    };
  }, [data]);

  /**
   * Filter data by date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Array} Filtered data
   */
  const getDataByDateRange = useMemo(() => {
    return (startDate, endDate) => {
      if (!data?.yearly) return [];

      const start = new Date(startDate);
      const end = new Date(endDate);

      return data.yearly.filter((d) => {
        const recordDate = new Date(
          `${d.year}-${d.date?.split("-")[1] || "01"}-01`
        );
        return recordDate >= start && recordDate <= end;
      });
    };
  }, [data]);

  /**
   * Filter data by season
   * @param {string} season - Season name ('spring', 'summer', 'fall', 'winter')
   * @param {string|number} year - Year to filter by (optional)
   * @returns {Array} Seasonal data
   */
  const getSeasonalData = useMemo(() => {
    return (season, year = null) => {
      if (!data?.yearly && !data?.monthly) return [];

      const seasonMonths = {
        spring: ["Mar", "Apr", "May"],
        summer: ["Jun", "Jul", "Aug"],
        fall: ["Sep", "Oct", "Nov"],
        winter: ["Dec", "Jan", "Feb"],
      };

      const months = seasonMonths[season.toLowerCase()];
      if (!months) return [];

      const sourceData = year
        ? data.yearly?.filter((d) => d.year === parseInt(year)) || []
        : data.monthly || [];

      return sourceData.filter((d) => months.includes(d.month));
    };
  }, [data]);

  /**
   * Get data for a specific month across all years
   * @param {string} month - Month name (e.g., 'Jan', 'Feb')
   * @returns {Array} Month data across years
   */
  const getMonthAcrossYears = useMemo(() => {
    return (month) => {
      if (!data?.yearly) return [];

      return data.yearly
        .filter((d) => d.month === month)
        .sort((a, b) => a.year - b.year);
    };
  }, [data]);

  /**
   * Get extreme weather records
   * @param {string} metric - Weather metric to analyze
   * @param {string} type - 'max' or 'min'
   * @param {number} limit - Number of records to return
   * @returns {Array} Extreme weather records
   */
  const getExtremeRecords = useMemo(() => {
    return (metric, type = "max", limit = 5) => {
      if (!data?.yearly) return [];

      const sortedData = [...data.yearly].sort((a, b) => {
        const aValue = a[metric] || 0;
        const bValue = b[metric] || 0;
        return type === "max" ? bValue - aValue : aValue - bValue;
      });

      return sortedData.slice(0, limit);
    };
  }, [data]);

  /**
   * Get data summary statistics
   * @param {Array} dataset - Data array to analyze
   * @returns {Object} Summary statistics
   */
  const getDataSummary = useMemo(() => {
    return (dataset = null) => {
      const workingData = dataset || data?.monthly || [];
      if (workingData.length === 0) return null;

      const metrics = [
        "temp",
        "tempMin",
        "tempMax",
        "rainfall",
        "humidity",
        "sunshine",
      ];
      const summary = {};

      metrics.forEach((metric) => {
        const values = workingData
          .map((d) => d[metric])
          .filter((v) => v !== null && v !== undefined && !isNaN(v));

        if (values.length > 0) {
          summary[metric] = {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((sum, v) => sum + v, 0) / values.length,
            total:
              metric === "rainfall" || metric === "sunshine"
                ? values.reduce((sum, v) => sum + v, 0)
                : null,
          };
        }
      });

      return summary;
    };
  }, [data]);

  /**
   * Search data by criteria
   * @param {Object} criteria - Search criteria object
   * @returns {Array} Matching records
   */
  const searchData = useMemo(() => {
    return (criteria) => {
      if (!data?.yearly) return [];

      return data.yearly.filter((record) => {
        return Object.entries(criteria).every(([key, value]) => {
          if (
            typeof value === "object" &&
            value.min !== undefined &&
            value.max !== undefined
          ) {
            // Range search
            const recordValue = record[key];
            return recordValue >= value.min && recordValue <= value.max;
          } else {
            // Exact match
            return record[key] === value;
          }
        });
      });
    };
  }, [data]);

  /**
   * Get comparative data between two years
   * @param {number} year1 - First year
   * @param {number} year2 - Second year
   * @returns {Object} Comparison data
   */
  const getYearComparison = useMemo(() => {
    return (year1, year2) => {
      if (!data?.yearly) return null;

      const data1 = data.yearly.filter((d) => d.year === year1);
      const data2 = data.yearly.filter((d) => d.year === year2);

      if (data1.length === 0 || data2.length === 0) return null;

      const comparison = {
        year1,
        year2,
        differences: {},
      };

      // Calculate differences for each metric
      const metrics = ["temp", "rainfall", "humidity", "sunshine"];
      metrics.forEach((metric) => {
        const avg1 =
          data1.reduce((sum, d) => sum + (d[metric] || 0), 0) / data1.length;
        const avg2 =
          data2.reduce((sum, d) => sum + (d[metric] || 0), 0) / data2.length;

        comparison.differences[metric] = {
          year1: avg1,
          year2: avg2,
          difference: avg2 - avg1,
          percentChange: avg1 !== 0 ? ((avg2 - avg1) / avg1) * 100 : 0,
        };
      });

      return comparison;
    };
  }, [data]);

  return {
    getFilteredData,
    getAvailableYears,
    getDataByDateRange,
    getSeasonalData,
    getMonthAcrossYears,
    getExtremeRecords,
    getDataSummary,
    searchData,
    getYearComparison,
  };
};
