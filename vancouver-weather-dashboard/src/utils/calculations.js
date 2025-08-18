// utils/calculations.js

/**
 * Calculate temperature statistics from weather data
 * @param {Array} data - Array of weather data objects
 * @returns {Object} Temperature statistics
 */
export const calculateTemperatureStats = (data) => {
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

  return {
    average: calculateAverage(temperatures),
    max: Math.max(...maxTemps),
    min: Math.min(...minTemps),
    range: Math.max(...maxTemps) - Math.min(...minTemps),
    hottestMonth: data.find((d) => d.tempMax === Math.max(...maxTemps))?.month,
    coldestMonth: data.find((d) => d.tempMin === Math.min(...minTemps))?.month,
  };
};

/**
 * Calculate rainfall statistics
 * @param {Array} data - Array of weather data objects
 * @returns {Object} Rainfall statistics
 */
export const calculateRainfallStats = (data) => {
  if (!data || data.length === 0) return null;

  const rainfallValues = data
    .map((d) => d.rainfall)
    .filter((r) => r !== null && r !== undefined);

  return {
    total: rainfallValues.reduce((sum, val) => sum + val, 0),
    average: calculateAverage(rainfallValues),
    max: Math.max(...rainfallValues),
    min: Math.min(...rainfallValues),
    wettest: data.find((d) => d.rainfall === Math.max(...rainfallValues))
      ?.month,
    driest: data.find((d) => d.rainfall === Math.min(...rainfallValues))?.month,
  };
};

/**
 * Calculate correlation coefficient between two variables
 * @param {Array} x - First variable array
 * @param {Array} y - Second variable array
 * @returns {number} Correlation coefficient (-1 to 1)
 */
export const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculate average of an array
 * @param {Array} values - Array of numbers
 * @returns {number} Average value
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate yearly aggregates from monthly data
 * @param {Array} yearlyData - Array of monthly data for multiple years
 * @returns {Array} Yearly aggregated data
 */
export const calculateYearlyAggregates = (yearlyData) => {
  const years = [...new Set(yearlyData.map((d) => d.year))];

  return years.map((year) => {
    const yearData = yearlyData.filter((d) => d.year === year);

    return {
      year,
      totalRainfall: Math.round(
        yearData.reduce((sum, d) => sum + d.rainfall, 0)
      ),
      avgTemp:
        Math.round(calculateAverage(yearData.map((d) => d.temp)) * 10) / 10,
      avgHumidity: Math.round(
        calculateAverage(yearData.map((d) => d.humidity))
      ),
      totalSunshine:
        Math.round(yearData.reduce((sum, d) => sum + d.sunshine, 0) * 10) / 10,
    };
  });
};

/**
 * Calculate moving average for trend analysis
 * @param {Array} data - Array of values
 * @param {number} window - Window size for moving average
 * @returns {Array} Array of moving averages
 */
export const calculateMovingAverage = (data, window = 3) => {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(data.length, i + Math.ceil(window / 2));
    const subset = data.slice(start, end);
    result.push(calculateAverage(subset));
  }

  return result;
};

/**
 * Detect anomalies in weather data
 * @param {Array} data - Array of weather data
 * @param {string} metric - Metric to analyze ('temp', 'rainfall', etc.)
 * @param {number} threshold - Standard deviations for anomaly detection
 * @returns {Array} Array of anomalies
 */
export const detectAnomalies = (data, metric, threshold = 2) => {
  const values = data
    .map((d) => d[metric])
    .filter((v) => v !== null && v !== undefined);
  const mean = calculateAverage(values);
  const variance = calculateAverage(values.map((v) => Math.pow(v - mean, 2)));
  const stdDev = Math.sqrt(variance);

  return data.filter((d) => {
    const value = d[metric];
    return Math.abs(value - mean) > threshold * stdDev;
  });
};
