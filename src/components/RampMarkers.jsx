import React from "react";
import { Marker } from "react-map-gl/mapbox";

export default function RampMarkers({ groupedReports, handleMarkerClick }) {
  return (
    <>
      {Object.entries(groupedReports).map(([rampSite, rampReports], index) => {
        const latitude = rampReports[0]?.ramps?.latitude || 47.6062; // Fallback to default if no latitude
        const longitude = rampReports[0]?.ramps?.longitude || -122.3321; // Fallback to default if no longitude

        return (
          <Marker
            key={index}
            longitude={longitude}
            latitude={latitude}
            onClick={() => handleMarkerClick(rampSite)}
          >
            <div className="relative ">
              <button className="text-2xl hover:text-red-500 hover:cursor-pointer">
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/material-sharp/24/boat-launch.png"
                  alt="boat-launch"
                />
              </button>
            </div>
          </Marker>
        );
      })}
    </>
  );
}
