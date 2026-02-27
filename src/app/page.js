"use client";

import MapDisplay from "@/components/MapDisplay";
import { useAllReports, useReportsByDate } from "@/hooks/useReports";
import { useEffect } from "react";
const Home = () => {
  const selectedDateRange = {
    pastDate: "2025-06-01",
    recentDate: new Date().toISOString().split("T")[0],
  };

  const { allReportsData, allReportsLoading, allReportsError } =
    useAllReports();

  const { reportsByDateData, reportsByDateLoading, reportsByDateError } =
    useReportsByDate(selectedDateRange.pastDate, selectedDateRange.recentDate);
  useEffect(() => {}, [reportsByDateData, allReportsData]);

  if (reportsByDateLoading)
    return (
      <div className="p-1 text-center animate-pulse">
        Loading date range data...
      </div>
    );

  if (reportsByDateError)
    return (
      <div className="p-1 text-center text-red-600">
        Error loading date-filtered reports
      </div>
    );

  return (
    <div>
      <h1 className="p-1 text-2xl font-bold text-center">
        Puget Sound Creel Reports
      </h1>

      <MapDisplay reports={reportsByDateData || allReportsData} />
    </div>
  );
};

export default Home;
