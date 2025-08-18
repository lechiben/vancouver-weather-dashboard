// services/weatherAPI.js
import {
  WEATHER_STATIONS,
  DATA_TIMEFRAMES,
  API_ENDPOINTS,
} from "../utils/constants.js";

/**
 * Weather API service for fetching data from various sources
 */
class WeatherAPIService {
  constructor() {
    this.baseURL = API_ENDPOINTS.ENVIRONMENT_CANADA;
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Fetch historical data from Environment Canada
   * @param {string} stationId - Weather station ID
   * @param {number} year - Year to fetch
   * @param {number} month - Month to fetch
   * @param {number} timeframe - Data timeframe (hourly, daily, monthly)
   * @returns {Promise<Array>} Weather data array
   */
  async fetchEnvironmentCanadaData(
    stationId,
    year,
    month,
    timeframe = DATA_TIMEFRAMES.DAILY
  ) {
    const cacheKey = `ec_${stationId}_${year}_${month}_${timeframe}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const url = `${this.baseURL}?format=csv&stationID=${stationId}&Year=${year}&Month=${month}&Day=14&timeframe=${timeframe}&submit=Download+Data`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const data = this.parseCSV(csvText);

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Error fetching Environment Canada data:", error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  /**
   * Fetch bulk historical data for multiple years
   * @param {string} stationId - Weather station ID
   * @param {number} startYear - Start year
   * @param {number} endYear - End year
   * @param {number} timeframe - Data timeframe
   * @returns {Promise<Array>} Combined weather data
   */
  async fetchBulkHistoricalData(
    stationId,
    startYear,
    endYear,
    timeframe = DATA_TIMEFRAMES.DAILY
  ) {
    const promises = [];

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        promises.push(
          this.fetchEnvironmentCanadaData(
            stationId,
            year,
            month,
            timeframe
          ).catch((error) => {
            console.warn(`Failed to fetch data for ${year}-${month}:`, error);
            return []; // Return empty array on failure
          })
        );
      }
    }

    try {
      const results = await Promise.all(promises);
      return results
        .flat()
        .filter((record) => record && Object.keys(record).length > 0);
    } catch (error) {
      console.error("Error fetching bulk data:", error);
      throw new Error("Failed to fetch bulk historical data");
    }
  }

  /**
   * Fetch current weather data (mock implementation)
   * @param {string} stationId - Weather station ID
   * @returns {Promise<Object>} Current weather data
   */
  async fetchCurrentWeather(stationId) {
    // In a real implementation, this would fetch from a real-time API
    return {
      temperature: 15.2,
      humidity: 73,
      rainfall: 0,
      windSpeed: 12,
      pressure: 1013.2,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Parse CSV data into JavaScript objects
   * @param {string} csvText - Raw CSV text
   * @returns {Array} Array of weather data objects
   */
  parseCSV(csvText) {
    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim());
      if (values.length !== headers.length) continue;

      const record = {};
      headers.forEach((header, index) => {
        const value = values[index];
        record[header] = this.convertValue(value);
      });

      data.push(record);
    }

    return data;
  }

  /**
   * Convert string values to appropriate types
   * @param {string} value - String value from CSV
   * @returns {any} Converted value
   */
  convertValue(value) {
    if (value === "" || value === null || value === undefined) return null;

    // Try to convert to number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) return numValue;

    // Try to convert to date
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value);
    }

    return value;
  }

  /**
   * Get station information
   * @param {string} stationId - Weather station ID
   * @returns {Object} Station information
   */
  getStationInfo(stationId) {
    return Object.values(WEATHER_STATIONS).find(
      (station) => station.id === stationId
    );
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPIService();
export default weatherAPI;
