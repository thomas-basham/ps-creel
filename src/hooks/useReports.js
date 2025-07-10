// lib/api.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const API_BASE = process.env.NEXT_PUBLIC_REPORTS_API_URL;

// All reports
export function useAllReports() {
  const {
    data: allReportsData,
    error: allReportsError,
    isLoading: allReportsLoading,
  } = useSWR(`${API_BASE}/reports?limit=10000`, fetcher);
  return {
    allReportsData,
    allReportsError,
    allReportsLoading,
  };
}

// Reports by date range
export function useReportsByDate(startDate, endDate) {
  // only fetch once we have both dates
  const shouldFetch = Boolean(startDate && endDate);
  const url = shouldFetch
    ? `${API_BASE}/reports/date?startDate=${startDate}&endDate=${endDate}`
    : null;

  const {
    data: reportsByDateData,
    error: reportsByDateError,
    isLoading: reportsByDateLoading,
  } = useSWR(url, fetcher);
  return {
    reportsByDateData,
    reportsByDateError,
    reportsByDateLoading,
  };
}
