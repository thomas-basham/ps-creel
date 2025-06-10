"use client";
import MapDisplay from "@/components/MapDisplay";
import { useReports } from "@/hooks/useReports";

const Home = () => {
  const { reports, isLoading, isError } = useReports();

  if (isLoading)
    return <div className="p-1 text-center animate-pulse ">Loading...</div>;
  if (isError)
    return (
      <div className="p-1 text-center text-red-600">Error loading reports</div>
    );
  // TODO: allow user to get reports by date range or by most recent amount of reports
  return (
    <div>
      <h1 className="p-1 text-center">Creel Reports Map</h1>
      <MapDisplay reports={reports} />
    </div>
  );
};

export default Home;
