"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import MapDisplay from "@/components/MapDisplay";
import { useAllReports, useReportsByDate } from "@/hooks/useReports";
import { useEffect } from "react";
const Home = () => {
  const selectedDateRange = {
    pastDate: "2024-01-01",
    recentDate: new Date().toISOString().split("T")[0],
  };

  const { allReportsData, allReportsLoading, allReportsError } =
    useAllReports();

  const { reportsByDateData, reportsByDateLoading, reportsByDateError } =
    useReportsByDate(selectedDateRange.pastDate, selectedDateRange.recentDate);
  useEffect(() => {}, [reportsByDateData, allReportsData]);

  if (reportsByDateLoading) return <FullScreenLoader />;

  if (reportsByDateError)
    return (
      <div className="p-1 text-center text-red-600">
        Error loading date-filtered reports
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-center gap-2 p-1">
        <h1 className="text-2xl font-bold text-center">Puget Sound Creel Reports</h1>
        <div className="relative group">
          <button
            type="button"
            aria-label="About this app"
            className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-700 rounded-full cursor-help"
          >
            i
          </button>
          <div
            role="tooltip"
            className="absolute z-20 w-80 max-w-[92vw] px-3 py-2 mt-2 text-xs text-white transition-opacity duration-150 -translate-x-1/2 bg-gray-800 rounded-md opacity-0 pointer-events-none left-1/2 top-full shadow-lg group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <p className="mb-2">
              This app is a map of fishing survey reports from Puget Sound.
              Each report records how many anglers fished and what species were
              caught.
            </p>
            <p className="mb-2">
              Colored zones are marine areas. Boat icons are launch ramps where
              anglers were surveyed.
            </p>
            <p className="mb-2">
              Click a marine area to see every report for that region, or click
              a ramp icon to see reports from one launch location.
            </p>
            <p>
              The panel shows total fish by species, report count, and detailed
              entries for each sampling date.
            </p>
          </div>
        </div>
      </div>

      <MapDisplay reports={reportsByDateData || allReportsData} />
    </div>
  );
};

export default Home;
