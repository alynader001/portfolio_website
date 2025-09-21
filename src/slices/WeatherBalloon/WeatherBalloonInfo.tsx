"use client";

import { useEffect, useState } from "react";

type BalloonCoord = [number, number, number];

type TimezoneInfo = {
  formatted: string;      // e.g., "2025-09-21 12:34:56"
  zoneName: string;       // e.g., "America/New_York"
  abbreviation: string;   // e.g., "EDT"
  gmtOffset: number;      // e.g., -14400
};

export default function WeatherBalloonInfo() {
  const [balloons, setBalloons] = useState<BalloonCoord[]>([]);
  const [selected, setSelected] = useState<BalloonCoord | null>(null);
  const [timezoneInfo, setTimezoneInfo] = useState<TimezoneInfo | null>(null);
  const [loadingTime, setLoadingTime] = useState(false);

  // Fetch balloons from server API
  useEffect(() => {
    async function fetchBalloons() {
      try {
        const res = await fetch("/api/balloons");
        const data: BalloonCoord[] = await res.json();
        setBalloons(data);
      } catch (err) {
        console.error("Failed to fetch balloons:", err);
      }
    }
    fetchBalloons();
  }, []);

  // Fetch timezone info whenever a balloon is selected
  useEffect(() => {
    if (!selected) {
      setTimezoneInfo(null);
      return;
    }

    async function fetchTimezone() {
      const [lat, lon] = selected;
      setLoadingTime(true);

      try {
        const res = await fetch(`/api/timezone?lat=${lat}&lon=${lon}`);
        const data: TimezoneInfo = await res.json();
        setTimezoneInfo(data);
      } catch (err) {
        console.error("Failed to fetch timezone info:", err);
        setTimezoneInfo(null);
      } finally {
        setLoadingTime(false);
      }
    }

    fetchTimezone();
  }, [selected]);

  return (
    <div className="flex flex-col h-screen">
      {/* Top heading */}
      <div className="p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">
          Select a balloon from the sidebar
        </h1>
      </div>

      {/* Main content */}
      <div className="flex flex-1 mt-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto rounded-lg">
          <h2 className="font-bold text-lg mb-4 text-black">Weather Balloons</h2>
          <ul className="space-y-2">
            {balloons.map((coords, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelected(coords)}
                  className={`w-full text-left p-2 rounded-lg shadow hover:bg-gray-200 ${
                    selected === coords ? "bg-gray-300 text-black" : "bg-white text-black"
                  }`}
                >
                  Balloon {index + 1}: {coords[0].toFixed(2)}, {coords[1].toFixed(2)}, alt {coords[2].toFixed(1)} km
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold">Balloon Details</h2>

          {selected ? (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Latitude:</strong> {selected[0]}
              </p>
              <p>
                <strong>Longitude:</strong> {selected[1]}
              </p>
              <p>
                <strong>Altitude:</strong> {selected[2]} km
              </p>

              {loadingTime ? (
                <p>Loading timezone info...</p>
              ) : timezoneInfo ? (
                <div>
                  <p>
                    <strong>Local Time:</strong> {timezoneInfo.formatted}
                  </p>
                  <p>
                    <strong>Timezone:</strong> {timezoneInfo.zoneName} ({timezoneInfo.abbreviation})
                  </p>
                  <p>
                    <strong>GMT Offset:</strong> {timezoneInfo.gmtOffset / 3600} hours
                  </p>
                </div>
              ) : (
                <p>Timezone info unavailable</p>
              )}
            </div>
          ) : (
            <p className="mt-4">No balloon selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
