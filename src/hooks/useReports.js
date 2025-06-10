import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useReports = () => {
  const { data, error, isLoading } = useSWR(
    process.env.NEXT_PUBLIC_REPORTS_API_URL + "/reports?limit=500",
    fetcher
  );

  return {
    reports: data,
    isLoading: isLoading,
    isError: error,
  };
};
