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

// Year-over-year comparison for a ramp or marine area over the same
// trailing window. Pass `enabled: false` to skip the request.
export function useYearCompare({
  scope,
  name,
  areaNumber,
  windowDays = 14,
  yearsBack = 4,
  enabled = true,
} = {}) {
  const hasTarget =
    scope === "ramp" ? Boolean(name) : scope === "area" ? Boolean(areaNumber) : false;
  const shouldFetch = Boolean(enabled && hasTarget);

  const params = new URLSearchParams();
  if (scope) params.set("scope", scope);
  if (scope === "ramp" && name) params.set("name", name);
  if (scope === "area" && areaNumber) params.set("areaNumber", String(areaNumber));
  params.set("windowDays", String(windowDays));
  params.set("yearsBack", String(yearsBack));

  const url = shouldFetch
    ? `${API_BASE}/reports/compare?${params.toString()}`
    : null;

  const {
    data: compareData,
    error: compareError,
    isLoading: compareLoading,
  } = useSWR(url, fetcher);

  return {
    compareData,
    compareError,
    compareLoading,
  };
}
