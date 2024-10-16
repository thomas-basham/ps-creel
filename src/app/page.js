'use client'
import MapDisplay from "@/components/MapDisplay";
import { useReports } from "@/hooks/useReports";

const Home = () => {
  const { reports, isLoading, isError } = useReports();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reports</div>;
  // TODO: allow user to get reports by date range or by most recent amount of reports
  return (
    <div>
      <h1>Creel Reports Map</h1>
      <MapDisplay reports={reports} />
    </div>
  );
};

export default Home;
