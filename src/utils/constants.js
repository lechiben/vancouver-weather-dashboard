// utils/constants.js
export const WEATHER_STATIONS = {
  VANCOUVER_HARBOUR: {
    id: "51442",
    name: "Vancouver Harbour CS",
    coordinates: { lat: 49.2827, lng: -123.1207 },
  },
  VANCOUVER_AIRPORT: {
    id: "51459",
    name: "Vancouver International Airport",
    coordinates: { lat: 49.1939, lng: -123.1844 },
  },
  VANCOUVER_UBC: {
    id: "889",
    name: "Vancouver (UBC)",
    coordinates: { lat: 49.2606, lng: -123.246 },
  },
};

export const DATA_TIMEFRAMES = {
  HOURLY: 1,
  DAILY: 2,
  MONTHLY: 3,
};

export const CHART_COLORS = {
  temperature: "#F59E0B",
  temperatureMax: "#DC2626",
  temperatureMin: "#2563EB",
  rainfall: "#3B82F6",
  humidity: "#06B6D4",
  sunshine: "#EAB308",
  correlation: "#8B5CF6",
};

export const MONTHS = [
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

export const TABS = {
  OVERVIEW: "overview",
  TEMPERATURE: "temperature",
  TRENDS: "trends",
  CORRELATIONS: "correlations",
};

export const API_ENDPOINTS = {
  ENVIRONMENT_CANADA:
    "https://climate.weather.gc.ca/climate_data/bulk_data_e.html",
  OPENWEATHER: "https://api.openweathermap.org/data/2.5",
};

export const VANCOUVER_CLIMATE_NORMALS = {
  ANNUAL_RAINFALL: 1194, // mm
  AVERAGE_TEMPERATURE: 11.2, // °C
  AVERAGE_HUMIDITY: 76, // %
  ANNUAL_SUNSHINE: 1928, // hours
};

export const CHART_DIMENSIONS = {
  SMALL: { width: "100%", height: 250 },
  MEDIUM: { width: "100%", height: 350 },
  LARGE: { width: "100%", height: 400 },
};
