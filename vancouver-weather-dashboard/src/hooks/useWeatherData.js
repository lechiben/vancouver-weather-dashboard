// hooks/useWeatherData.js
import { useState, useEffect, useCallback } from "react";
import { weatherAPI } from "../services/weatherAPI.js";
import { generateSampleData } from "../data/sampleData.js";
import { WEATHER_STATIONS } from "../utils/constants.js";

/**
 * Custom hook for managing weather data state and API calls
 * @param {Object} options - Configuration options
 * @returns {Object} Weather data state and methods
 */
export const useWeatherData = (options = {}) => {
  const {
    stationId = WEATHER_STATIONS.VANCOUVER_HARBOUR.id,
    startYear = 2020,
    endYear = 2024,
    useSampleData = true, // Toggle for development
  } = options;

  const [data, setData] = useState({ monthly: [], yearly: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  /**
   * Fetch weather data from API or use sample data
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useSampleData) {
        // Use sample data for development
        const sampleData = generateSampleData();
        setData(sampleData);
        setLastFetch(new Date());
      } else {
        // Fetch real data from Environment Canada
        const rawData = await weatherAPI.fetchBulkHistoricalData(
          stationId,
          startYear,
          endYear
        );

        const processedData = processRawData(rawData);
        setData(processedData);
        setLastFetch(new Date());
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err.message);

      // Fallback to sample data on error
      const sampleData = generateSampleData();
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  }, [stationId, startYear, endYear, useSampleData]);

  /**
   * Process raw API data into the format expected by components
   * @param {Array} rawData - Raw data from API
   * @returns {Object} Processed data object
   */
  const processRawData = (rawData) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Group data by year and month
    const groupedData = rawData.reduce((acc, record) => {
      const date = new Date(record.Date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];

      acc[year][month].push(record);
      return acc;
    }, {});

    // Calculate monthly averages
    const yearlyData = [];
    const monthlyAverages = Array(12)
      .fill()
      .map((_, i) => ({
        month: months[i],
        rainfall: 0,
        temp: 0,
        tempMin: 0,
        tempMax: 0,
        humidity: 0,
        sunshine: 0,
        count: 0,
      }));

    Object.entries(groupedData).forEach(([year, monthData]) => {
      Object.entries(monthData).forEach(([monthIndex, records]) => {
        const monthName = months[parseInt(monthIndex)];

        // Calculate averages for this month
        const avgTemp =
          records.reduce((sum, r) => sum + (r["Mean Temp (°C)"] || 0), 0) /
          records.length;
        const totalRain = records.reduce(
          (sum, r) => sum + (r["Total Rain (mm)"] || 0),
          0
        );
        const avgHumidity =
          records.reduce((sum, r) => sum + (r["Rel Hum (%)"] || 0), 0) /
          records.length;

        const monthlyRecord = {
          year: parseInt(year),
          month: monthName,
          date: `${year}-${String(parseInt(monthIndex) + 1).padStart(2, "0")}`,
          temp: Math.round(avgTemp * 10) / 10,
          tempMin: Math.round((avgTemp - 3) * 10) / 10, // Approximate
          tempMax: Math.round((avgTemp + 3) * 10) / 10, // Approximate
          rainfall: Math.round(totalRain * 10) / 10,
          humidity: Math.round(avgHumidity),
          sunshine: Math.round((8 - totalRain / 20) * 10) / 10, // Estimated
        };

        yearlyData.push(monthlyRecord);

        // Add to monthly averages
        const monthIdx = parseInt(monthIndex);
        monthlyAverages[monthIdx].rainfall += totalRain;
        monthlyAverages[monthIdx].temp += avgTemp;
        monthlyAverages[monthIdx].tempMin += avgTemp - 3;
        monthlyAverages[monthIdx].tempMax += avgTemp + 3;
        monthlyAverages[monthIdx].humidity += avgHumidity;
        monthlyAverages[monthIdx].count++;
      });
    });

    // Calculate final averages
    const monthly = monthlyAverages
      .map((month) => ({
        ...month,
        rainfall:
          month.count > 0
            ? Math.round((month.rainfall / month.count) * 10) / 10
            : 0,
        temp:
          month.count > 0
            ? Math.round((month.temp / month.count) * 10) / 10
            : 0,
        tempMin:
          month.count > 0
            ? Math.round((month.tempMin / month.count) * 10) / 10
            : 0,
        tempMax:
          month.count > 0
            ? Math.round((month.tempMax / month.count) * 10) / 10
            : 0,
        humidity:
          month.count > 0 ? Math.round(month.humidity / month.count) : 0,
        sunshine:
          month.count > 0
            ? Math.round((month.sunshine / month.count) * 10) / 10
            : 0,
      }))
      .map(({ count, ...month }) => month);

    return { monthly, yearly: yearlyData };
  };

  /**
   * Refresh data manually
   */
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Switch between sample and real data
   */
  const toggleDataSource = useCallback(() => {
    // This would toggle the useSampleData option and refetch
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastFetch,
    refreshData,
    toggleDataSource,
    stationInfo: weatherAPI.getStationInfo(stationId),
  };
};
