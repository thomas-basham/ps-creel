"use client";
import React, { useState, useMemo, useCallback } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import _ from "lodash"; // Lodash to help with grouping

const MapDisplay = ({ reports }) => {
  const [viewport, setViewport] = useState({
    latitude: 47.6062, // Default to Seattle
    longitude: -122.3321,
    zoom: 10,
    width: "100%",
    height: "400px",
  });

  const [selectedRamp, setSelectedRamp] = useState(null); // Track the selected ramp

  // Group reports by Ramp_site
  const groupedReports = useMemo(() => {
    return _.groupBy(reports, "Ramp_site");
  }, [reports]);

  // Handle marker clicks to show all reports for a Ramp_site
  const handleMarkerClick = useCallback(
    (rampSite) => {
      setSelectedRamp(groupedReports[rampSite]);
    },
    [groupedReports]
  );

  // Calculate total fish caught for the selected ramp (by species)
  const getTotalSpeciesCaught = (rampReports) => {
    const totalFish = {
      Chinook: 0,
      Coho: 0,
      Chum: 0,
      Pink: 0,
      Sockeye: 0,
      Lingcod: 0,
      Halibut: 0,
    };

    rampReports.forEach((report) => {
      totalFish.Chinook += report.Chinook || 0;
      totalFish.Coho += report.Coho || 0;
      totalFish.Chum += report.Chum || 0;
      totalFish.Pink += report.Pink || 0;
      totalFish.Sockeye += report.Sockeye || 0;
      totalFish.Lingcod += report.Lingcod || 0;
      totalFish.Halibut += report.Halibut || 0;
    });

    return totalFish;
  };

  const getTotalFishCaught = (totalFish) => {
    return (
      totalFish.Chinook +
      totalFish.Coho +
      totalFish.Chum +
      totalFish.Pink +
      totalFish.Sockeye +
      totalFish.Lingcod +
      totalFish.Halibut
    );
  };

  // Get the date range for the reports (since they are sorted by date)
  const reportDateRange = useMemo(() => {
    if (reports.length === 0) return "No reports available";

    const firstDate = new Date(reports[0].Sample_date);
    const lastDate = new Date(reports[reports.length - 1].Sample_date);

    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  }, [reports]);

  return (
    <div className="relative flex flex-col items-center w-full h-full">
      {/* Date Range Pill */}
      <div className="absolute z-10 px-4 py-1 text-sm text-white bg-gray-800 rounded-full shadow-lg top-4">
        Reports from: {reportDateRange}
      </div>

      <div className="relative w-full h-96 md:h-[90vh]">
        <Map
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onMoveEnd={(event) => setViewport(event.viewState)} // Trigger only on move end
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          style={{ width: "100%", height: "100%" }}
        >
          {Object.entries(groupedReports).map(
            ([rampSite, rampReports], index) => {
              const latitude = rampReports[0]?.ramps?.latitude || 47.6062; // Fallback to default if no latitude
              const longitude = rampReports[0]?.ramps?.longitude || -122.3321; // Fallback to default if no longitude

              return (
                <Marker
                  key={index}
                  longitude={longitude}
                  latitude={latitude}
                  onClick={() => handleMarkerClick(rampSite)}
                >
                  <div className="relative">
                    <button className="text-2xl hover:text-red-500">🐠</button>
                  </div>
                </Marker>
              );
            }
          )}
        </Map>
      </div>

      {/* Popup showing all reports for the selected ramp */}
      {selectedRamp && (
        <div className="absolute max-h-full p-4 overflow-auto bg-white rounded-md shadow-lg bottom-4 left-4">
          <small className="text-gray-600">
            Showing {reports.length} most recent reports
          </small>
          <h2 className="text-xl font-bold text-gray-800">
            Reports for {selectedRamp[0].Ramp_site}
          </h2>

          {/* Total Fish Caught by Species */}
          <p className="font-semibold text-gray-700 text-md">
            Total Fish Caught:{" "}
            {getTotalFishCaught(getTotalSpeciesCaught(selectedRamp))}
          </p>
          <ul className="mb-4">
            {Object.entries(getTotalSpeciesCaught(selectedRamp)).map(
              ([species, total], idx) =>
                total > 0 && (
                  <li key={idx} className="text-gray-600">
                    {species}: {total}
                  </li>
                )
            )}
          </ul>

          <ul className="text-gray-600">
            {selectedRamp.map((report, idx) => (
              <li key={idx} className="mb-2">
                <p>{report.Sample_date}</p>
                <p>Anglers: {report.Anglers}</p>
                {/* Show only fish caught if greater than 0 */}
                {report.Chinook > 0 && <p>Chinook: {report.Chinook}</p>}
                {report.Coho > 0 && <p>Coho: {report.Coho}</p>}
                {report.Chum > 0 && <p>Chum: {report.Chum}</p>}
                {report.Pink > 0 && <p>Pink: {report.Pink}</p>}
                {report.Sockeye > 0 && <p>Sockeye: {report.Sockeye}</p>}
                {report.Lingcod > 0 && <p>Lingcod: {report.Lingcod}</p>}
                {report.Halibut > 0 && <p>Halibut: {report.Halibut}</p>}

                <hr className="my-2" />
              </li>
            ))}
          </ul>

          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => setSelectedRamp(null)} // Close the popup
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
