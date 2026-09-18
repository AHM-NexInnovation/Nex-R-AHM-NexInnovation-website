// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { auth, db, signOut, ref, onValue } from "../firebase";

export default function Dashboard({ currentUser }) {
  const [temperature, setTemperature] = useState(null);
  const [threshold, setThreshold] = useState(35); // Default to 35 if not found in DB

  const MIN_TEMP = 0;
  const MAX_TEMP = 50;

  useEffect(() => {
    // 1. Listen for Temperature changes
    const tempRef = ref(db, "sensor/temperature");
    const unsubscribeTemp = onValue(tempRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    // 2. Listen for Threshold changes
    const thresholdRef = ref(db, "sensor/threshold");
    const unsubscribeThreshold = onValue(thresholdRef, (snapshot) => {
      if (snapshot.val() !== null) {
        setThreshold(snapshot.val());
      }
    });

    // Cleanup both listeners when component unmounts
    return () => {
      unsubscribeTemp();
      unsubscribeThreshold();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // Dynamically calculate status based on live data
  let status = "NO DATA";
  if (temperature !== null) {
    status = temperature > threshold ? "ERROR" : "OK";
  }

  const isError = status === "ERROR";
  const displayTemp = temperature !== null ? temperature : 0;

  const clampedTemp = Math.min(Math.max(displayTemp, MIN_TEMP), MAX_TEMP);
  const tempPercentage = (clampedTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  const needleRotation = tempPercentage * 180;
  const thresholdPercentage = (threshold - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  const thresholdRotation = thresholdPercentage * 180;

  const username = currentUser.email.split("@")[0];

  return (
    <div className="dashboard-wrapper">
      <nav className="top-navbar">
        <div className="nav-brand">
          <span className="ai-highlight">AI</span> HEALTH
        </div>
        <div className="nav-actions">
          <span className="user-email">@{username}</span>
          <button onClick={handleLogout} className="logout-btn-nav">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </nav>

      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <main className="dashboard-content">
        <div className="glass-panel temp-module">
          <h2 className="module-title">Core Temperature</h2>

          <div className="gauge-container">
            <svg viewBox="0 0 240 130" className="gauge-svg">
              <defs>
                <linearGradient
                  id="gaugeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="var(--ai-primary)" />
                  <stop offset="50%" stopColor="var(--ai-secondary)" />
                  <stop offset="100%" stopColor="var(--color-error)" />
                </linearGradient>
              </defs>

              <path
                d="M 20 110 A 90 90 0 0 1 220 110"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 110 A 90 90 0 0 1 220 110"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - 283 * tempPercentage}
                className="gauge-value-arc"
              />

              {/* Threshold Red Line */}
              <line
                x1="20"
                y1="110"
                x2="40"
                y2="110"
                stroke="var(--color-error)"
                strokeWidth="4"
                transform={`rotate(${thresholdRotation} 120 110)`}
              />

              <g
                transform={`rotate(${needleRotation} 120 110)`}
                className="gauge-needle"
              >
                <circle cx="120" cy="110" r="6" fill="#fff" />
                <path d="M 120 113 L 30 110 L 120 107 Z" fill="#fff" />
              </g>
            </svg>

            <div className="gauge-readout">
              {temperature !== null ? `${temperature}°C` : "--°C"}
            </div>
          </div>

          <div className="gauge-labels">
            <span>{MIN_TEMP}°C</span>
            <span className="threshold-label">Thr: {threshold}°C</span>
            <span>{MAX_TEMP}°C</span>
          </div>
        </div>

        <div
          className={`glass-panel status-module ${isError ? "status-error" : "status-ok"}`}
        >
          <h2 className="module-title">System Status</h2>
          <div className="status-indicator">
            <div className="pulse-ring"></div>
            <span className="status-text">{status}</span>
          </div>
          {isError && <p className="warning-text">Threshold exceeded!</p>}
        </div>
      </main>
    </div>
  );
}
