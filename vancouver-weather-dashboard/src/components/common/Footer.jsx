// components/common/Footer.jsx
import React, { useState } from "react";

/**
 * Professional Footer Component for Weather Dashboard
 * Includes data sources, tech stack, and utility functions
 */
const Footer = ({
  dataSource = "Environment and Climate Change Canada",
  techStack = "React, Recharts, Tailwind CSS",
  onRefresh,
  cacheInfo,
  showDetailedInfo = true,
  stationInfo,
}) => {
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      setLastRefresh(new Date());
    }
  };

  const formatLastUpdated = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Vancouver",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      {/* Main Footer Content */}
      {showDetailedInfo && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data Source Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🌡️</span>
                Data Sources
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <p className="font-medium">Primary Source</p>
                  <p>{dataSource}</p>
                </div>
                {stationInfo && (
                  <div>
                    <p className="font-medium">Weather Station</p>
                    <p>
                      {stationInfo.name || "Vancouver International Airport"}
                    </p>
                    <p className="text-xs">
                      {stationInfo.coordinates
                        ? `${stationInfo.coordinates.lat}°N, ${stationInfo.coordinates.lng}°W`
                        : "49.1939°N, 123.1844°W"}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Climate Normals</p>
                  <p>1981-2010 Reference Period</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p>{formatLastUpdated(cacheInfo?.lastUpdated)} PST</p>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <span className="mr-2">⚙️</span>
                Technical Stack
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <p className="font-medium">Frontend</p>
                  <p>{techStack}</p>
                </div>
                <div>
                  <p className="font-medium">Architecture</p>
                  <p>Modular React Components</p>
                </div>
                <div>
                  <p className="font-medium">Deployment</p>
                  <p>Vercel Edge Network</p>
                </div>
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  className="text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  {showTechDetails ? "Hide" : "Show"} Technical Details
                </button>
                {showTechDetails && (
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                    <p>
                      <strong>Components:</strong> 12+ modular React components
                    </p>
                    <p>
                      <strong>Hooks:</strong> Custom data management hooks
                    </p>
                    <p>
                      <strong>Charts:</strong> Recharts with custom tooltips
                    </p>
                    <p>
                      <strong>Styling:</strong> Tailwind CSS utility-first
                    </p>
                    <p>
                      <strong>API Ready:</strong> Environment Canada integration
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📊</span>
                Dashboard Status
              </h4>
              <div className="text-sm text-gray-600 space-y-3">
                {/* Status Indicators */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Data Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>API Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Sample Mode</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {onRefresh && (
                    <button
                      onClick={handleRefresh}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <span>🔄</span>
                      <span>Refresh Data</span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      window.open(
                        "https://github.com/yourusername/vancouver-weather-dashboard",
                        "_blank"
                      )
                    }
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center space-x-1"
                  >
                    <span>📂</span>
                    <span>View Source</span>
                  </button>
                </div>

                {/* Performance Info */}
                {cacheInfo && (
                  <div className="text-xs text-gray-500">
                    <p>
                      Data Quality: {cacheInfo.dataQuality || "Research-grade"}
                    </p>
                    {lastRefresh && (
                      <p>Last Refresh: {lastRefresh.toLocaleTimeString()}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            {/* Copyright & Attribution */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p>© 2024 Vancouver Weather Dashboard</p>
              <p>Built for BCIT CST Co-op Portfolio</p>
              <a
                href="https://climate.weather.gc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Environment Canada Data
              </a>
            </div>

            {/* Links & Social */}
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="LinkedIn Profile"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="GitHub Profile"
              >
                📂 GitHub
              </a>
              <a
                href="mailto:your.email@example.com"
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Email Contact"
              >
                ✉️ Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Minimal Footer - For simple pages
 */
export const MinimalFooter = ({ dataSource, techStack }) => {
  return (
    <footer className="mt-8 py-6 text-center text-gray-600 border-t border-gray-200">
      <p className="text-sm">
        Data: {dataSource} | Built with {techStack}
      </p>
      <p className="text-xs mt-2">
        © 2024 Vancouver Weather Dashboard - BCIT CST Portfolio Project
      </p>
    </footer>
  );
};

/**
 * Sticky Footer - Stays at bottom of viewport
 */
export const StickyFooter = ({ children, ...props }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <Footer {...props} />
    </div>
  );
};

/**
 * Footer with Newsletter Signup - For marketing sites
 */
export const FooterWithNewsletter = ({ ...props }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Newsletter signup logic here
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Newsletter Section */}
        <div className="mb-8 text-center">
          <h4 className="text-lg font-semibold mb-4">
            Stay Updated with Vancouver Weather Insights
          </h4>
          {!subscribed ? (
            <form
              onSubmit={handleSubscribe}
              className="flex justify-center max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r transition-colors"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="text-green-400">✅ Thanks for subscribing!</p>
          )}
        </div>

        {/* Regular Footer Content */}
        <div className="text-gray-300">
          <Footer {...props} showDetailedInfo={false} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
