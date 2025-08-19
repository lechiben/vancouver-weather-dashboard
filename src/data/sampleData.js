// data/sampleData.js
import { MONTHS } from "../utils/constants.js";

/**
 * Generate realistic Vancouver weather sample data
 * Based on historical climate patterns for Vancouver, BC
 * @returns {Object} Sample weather data object
 */
export const generateSampleData = () => {
  // Vancouver typical patterns: wet winters, dry summers, mild temperatures
  const baseData = [
    {
      month: "Jan",
      rainfall: 168,
      temp: 3,
      tempMin: 1,
      tempMax: 6,
      humidity: 84,
      sunshine: 3.9,
    },
    {
      month: "Feb",
      rainfall: 106,
      temp: 5,
      tempMin: 2,
      tempMax: 8,
      humidity: 82,
      sunshine: 5.2,
    },
    {
      month: "Mar",
      rainfall: 114,
      temp: 7,
      tempMin: 4,
      tempMax: 11,
      humidity: 79,
      sunshine: 6.8,
    },
    {
      month: "Apr",
      rainfall: 84,
      temp: 10,
      tempMin: 6,
      tempMax: 15,
      humidity: 74,
      sunshine: 8.1,
    },
    {
      month: "May",
      rainfall: 65,
      temp: 14,
      tempMin: 9,
      tempMax: 19,
      humidity: 71,
      sunshine: 9.4,
    },
    {
      month: "Jun",
      rainfall: 54,
      temp: 17,
      tempMin: 12,
      tempMax: 22,
      humidity: 69,
      sunshine: 10.1,
    },
    {
      month: "Jul",
      rainfall: 31,
      temp: 20,
      tempMin: 14,
      tempMax: 25,
      humidity: 67,
      sunshine: 10.6,
    },
    {
      month: "Aug",
      rainfall: 37,
      temp: 20,
      tempMin: 14,
      tempMax: 25,
      humidity: 68,
      sunshine: 9.8,
    },
    {
      month: "Sep",
      rainfall: 64,
      temp: 17,
      tempMin: 11,
      tempMax: 22,
      humidity: 72,
      sunshine: 7.5,
    },
    {
      month: "Oct",
      rainfall: 121,
      temp: 12,
      tempMin: 7,
      tempMax: 16,
      humidity: 78,
      sunshine: 5.3,
    },
    {
      month: "Nov",
      rainfall: 182,
      temp: 7,
      tempMin: 4,
      tempMax: 10,
      humidity: 83,
      sunshine: 4.1,
    },
    {
      month: "Dec",
      rainfall: 168,
      temp: 4,
      tempMin: 1,
      tempMax: 7,
      humidity: 85,
      sunshine: 3.9,
    },
  ];

  // Generate multi-year data with realistic variations
  const years = [2020, 2021, 2022, 2023, 2024];
  const yearlyData = [];

  years.forEach((year) => {
    baseData.forEach((monthData, index) => {
      // Add realistic year-to-year and random variations
      const climateVariation = getClimateVariation(year, index);
      const randomVariation = getRandomVariation();

      const record = {
        ...monthData,
        year,
        date: `${year}-${String(index + 1).padStart(2, "0")}`,
        monthIndex: index,
        // Apply variations while keeping values realistic
        rainfall: Math.max(
          0,
          monthData.rainfall *
            (1 + climateVariation.rainfall + randomVariation.rainfall)
        ),
        temp: monthData.temp + climateVariation.temp + randomVariation.temp,
        tempMin:
          monthData.tempMin + climateVariation.temp + randomVariation.temp,
        tempMax:
          monthData.tempMax + climateVariation.temp + randomVariation.temp,
        humidity: Math.max(
          40,
          Math.min(
            100,
            monthData.humidity *
              (1 + climateVariation.humidity + randomVariation.humidity)
          )
        ),
        sunshine: Math.max(
          0,
          monthData.sunshine *
            (1 + climateVariation.sunshine + randomVariation.sunshine)
        ),
      };

      // Round values to realistic precision
      record.rainfall = Math.round(record.rainfall * 10) / 10;
      record.temp = Math.round(record.temp * 10) / 10;
      record.tempMin = Math.round(record.tempMin * 10) / 10;
      record.tempMax = Math.round(record.tempMax * 10) / 10;
      record.humidity = Math.round(record.humidity);
      record.sunshine = Math.round(record.sunshine * 10) / 10;

      yearlyData.push(record);
    });
  });

  return {
    monthly: baseData,
    yearly: yearlyData,
    metadata: {
      source: "Generated sample data based on Vancouver climate normals",
      period: "2020-2024",
      station: "Vancouver Harbour CS (Sample)",
      lastUpdated: new Date().toISOString(),
    },
  };
};

/**
 * Get climate variation based on year and month (simulates climate trends)
 * @param {number} year - Year
 * @param {number} monthIndex - Month index (0-11)
 * @returns {Object} Climate variation factors
 */
const getClimateVariation = (year, monthIndex) => {
  // Simulate some climate trends
  const yearFactor = (year - 2020) * 0.01; // Slight warming trend
  const laninaTrend = year === 2022 ? 0.1 : 0; // La Niña effect in 2022

  // Seasonal variations
  const isWinter = monthIndex <= 1 || monthIndex >= 11;
  const isSummer = monthIndex >= 5 && monthIndex <= 7;

  return {
    temp: yearFactor * 0.5 + laninaTrend * (isWinter ? -0.5 : 0.2),
    rainfall: laninaTrend * (isWinter ? 0.2 : -0.1),
    humidity: laninaTrend * 0.05,
    sunshine: -laninaTrend * 0.1,
  };
};

/**
 * Get random variation within realistic bounds
 * @returns {Object} Random variation factors
 */
const getRandomVariation = () => {
  return {
    rainfall: (Math.random() - 0.5) * 0.4, // ±20% variation
    temp: (Math.random() - 0.5) * 3, // ±1.5°C variation
    humidity: (Math.random() - 0.5) * 0.2, // ±10% variation
    sunshine: (Math.random() - 0.5) * 0.3, // ±15% variation
  };
};

/**
 * Generate extreme weather events for testing
 * @returns {Array} Array of extreme weather records
 */
export const generateExtremeWeatherData = () => {
  return [
    {
      date: "2021-06-28",
      event: "Heat Dome",
      temp: 31.5,
      tempMax: 35.2,
      description: "Record-breaking heat dome event",
    },
    {
      date: "2022-11-15",
      event: "Atmospheric River",
      rainfall: 89.2,
      description: "Heavy rainfall from atmospheric river",
    },
    {
      date: "2024-01-13",
      event: "Arctic Outflow",
      temp: -8.1,
      tempMin: -12.3,
      description: "Rare cold snap with Arctic air mass",
    },
  ];
};

/**
 * Generate hourly data for a specific day (for detailed analysis)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Hourly weather data
 */
export const generateHourlyData = (date) => {
  const baseTemp = 15; // Base temperature
  const hourlyData = [];

  for (let hour = 0; hour < 24; hour++) {
    // Simulate daily temperature cycle
    const tempVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 8; // Peak at 2 PM
    const randomVariation = (Math.random() - 0.5) * 2;

    hourlyData.push({
      date,
      hour,
      time: `${String(hour).padStart(2, "0")}:00`,
      temp: Math.round((baseTemp + tempVariation + randomVariation) * 10) / 10,
      humidity: Math.round(75 - tempVariation * 2 + (Math.random() - 0.5) * 10),
      pressure: Math.round(1013 + (Math.random() - 0.5) * 20),
      windSpeed: Math.round((5 + Math.random() * 10) * 10) / 10,
      rainfall: hour >= 14 && hour <= 16 ? Math.random() * 2 : 0, // Rain in afternoon
    });
  }

  return hourlyData;
};

/**
 * Get climate normals for comparison
 * @returns {Object} Climate normal data
 */
export const getClimateNormals = () => {
  return {
    period: "1981-2010",
    annual: {
      temperature: 11.2,
      rainfall: 1194,
      humidity: 76,
      sunshine: 1928,
    },
    monthly: [
      { month: "Jan", temp: 3.0, rainfall: 168, humidity: 84 },
      { month: "Feb", temp: 5.0, rainfall: 106, humidity: 82 },
      { month: "Mar", temp: 7.0, rainfall: 114, humidity: 79 },
      { month: "Apr", temp: 10.0, rainfall: 84, humidity: 74 },
      { month: "May", temp: 14.0, rainfall: 65, humidity: 71 },
      { month: "Jun", temp: 17.0, rainfall: 54, humidity: 69 },
      { month: "Jul", temp: 20.0, rainfall: 31, humidity: 67 },
      { month: "Aug", temp: 20.0, rainfall: 37, humidity: 68 },
      { month: "Sep", temp: 17.0, rainfall: 64, humidity: 72 },
      { month: "Oct", temp: 12.0, rainfall: 121, humidity: 78 },
      { month: "Nov", temp: 7.0, rainfall: 182, humidity: 83 },
      { month: "Dec", temp: 4.0, rainfall: 168, humidity: 85 },
    ],
  };
};

export default generateSampleData;
