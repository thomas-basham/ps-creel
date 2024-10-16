import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useReports = () => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_REPORTS_API_URL + "/reports?limit=500",
    fetcher
  );
  console.log(data)

  return {
    reports: data,
    isLoading: !error && !data,
    isError: error,
  };
};
