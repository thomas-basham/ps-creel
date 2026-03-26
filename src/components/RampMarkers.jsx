import React from "react";
import { Marker } from "react-map-gl/mapbox";

export default function RampMarkers({ groupedReports, handleMarkerClick }) {
  return (
    <>
      {Object.entries(groupedReports).map(([rampSite, rampReports], index) => {
        const latitude = Number(rampReports[0]?.ramps?.latitude || 47.6062);
        const longitude = Number(rampReports[0]?.ramps?.longitude || -122.3321);
        const rampLabel = rampSite || `Ramp ${index + 1}`;
        const reportCount =
          rampReports.length > 99 ? "99+" : rampReports.length.toString();

        return (
          <Marker
            key={`${rampLabel}-${index}`}
            longitude={longitude}
            latitude={latitude}
            anchor="center"
            onClick={(event) => {
              event.originalEvent?.stopPropagation();
              handleMarkerClick(rampSite);
            }}
          >
            <button
              type="button"
              title={rampLabel}
              aria-label={`View reports for ${rampLabel}`}
              className="group relative flex h-11 w-11 items-center justify-center bg-transparent focus:outline-none"
            >
              <span className="absolute inset-0 rounded-full border border-cyan-100/18 bg-[#03131f]/84 shadow-[0_0_30px_rgba(39,187,255,0.18)] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:border-cyan-100/36 group-hover:shadow-[0_0_42px_rgba(39,187,255,0.28)]" />
              <span className="creel-loader-ring absolute inset-[7px] rounded-full border border-cyan-200/16" />
              <span className="absolute top-[75%] h-3 w-px bg-gradient-to-b from-cyan-50/80 to-transparent" />
              <span className="creel-loader-dot absolute h-2 w-2 rounded-full bg-cyan-50" />
              <span className="relative h-3.5 w-3.5 rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(133,232,255,0.95)]" />
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full border border-cyan-100/14 bg-[#03111b] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-cyan-50 shadow-[0_0_18px_rgba(0,0,0,0.35)]">
                {reportCount}
              </span>
            </button>
          </Marker>
        );
      })}
    </>
  );
}
