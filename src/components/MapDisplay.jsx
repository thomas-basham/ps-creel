// src/components/MapDisplay.jsx
"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Map, { NavigationControl, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import _ from "lodash";

import MarineAreaBoundaries from "./MarineAreaBoundaries";
import RampMarkers from "./RampMarkers";
import RampReports from "./RampReports";

export default function MapDisplay({ reports }) {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 47.8562,
    longitude: -123.3321,
    zoom: 8,
  });
  const [selectedRamp, setSelectedRamp] = useState(null);
  const [areaInfo, setAreaInfo] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const groupedReports = useMemo(
    () => _.groupBy(reports, "Ramp_site"),
    [reports]
  );

  const handleMarkerClick = useCallback(
    (rampSite) => setSelectedRamp(groupedReports[rampSite]),
    [groupedReports]
  );

  const reportDateRange = useMemo(() => {
    if (!reports.length) return "No reports available";
    const first = new Date(reports[0].Sample_date);
    const last = new Date(reports[reports.length - 1].Sample_date);
    return `${first.toLocaleDateString()} – ${last.toLocaleDateString()}`;
  }, [reports]);

  return (
    <div className="relative flex flex-col items-center w-full h-full">
      {/* Date Range Pill */}
      <div className="absolute z-10 px-4 py-1 text-sm text-white bg-gray-800 rounded-full shadow-lg top-4">
        Reports from: {reportDateRange}
      </div>

      <div className="w-full h-[100vh] ">
        <Map
          ref={mapRef}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          onMoveEnd={(evt) => setViewport(evt.viewState)}
          // tell it which layer to listen on
          interactiveLayerIds={["marine-fill"]}
          // hover
          onMouseMove={(evt) => {
            const feature = evt.features?.find(
              (f) => f.layer.id === "marine-fill"
            );
            const newId = feature?.id ?? null;
            if (hoveredId !== newId) {
              // clear old hover
              if (hoveredId !== null) {
                mapRef.current
                  .getMap()
                  .setFeatureState(
                    { source: "marine-areas", id: hoveredId },
                    { hover: false }
                  );
              }
              // set new hover
              if (newId !== null) {
                mapRef.current
                  .getMap()
                  .setFeatureState(
                    { source: "marine-areas", id: newId },
                    { hover: true }
                  );
              }
              setHoveredId(newId);
            }
          }}
          // leave → clear hover
          onMouseLeave={() => {
            if (hoveredId !== null) {
              mapRef.current
                .getMap()
                .setFeatureState(
                  { source: "marine-areas", id: hoveredId },
                  { hover: false }
                );
              setHoveredId(null);
            }
          }}
          // click → popup
          onClick={(evt) => {
            const feature = evt.features?.find(
              (f) => f.layer.id === "marine-fill"
            );
            if (feature) {
              const [lng, lat] = evt.lngLat.toArray();
              setAreaInfo({ lngLat: [lng, lat], props: feature.properties });
            }
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />

          <MarineAreaBoundaries />

          <RampMarkers
            groupedReports={groupedReports}
            handleMarkerClick={handleMarkerClick}
          />

          {areaInfo && (
            <Popup
              longitude={areaInfo.lngLat[0]}
              latitude={areaInfo.lngLat[1]}
              closeButton={false}
              closeOnClick={false}
              className="pointer-events-auto"
              onClose={() => setAreaInfo(null)}
              anchor="bottom"
              offset={[0, -10]}
            >
              <div style={{ fontSize: 12 }}>
                <strong className="dark:text-black">
                  Area {areaInfo.props.maNumber}
                </strong>
                <div className="dark:text-black">{areaInfo.props.maName}</div>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <RampReports
        selectedRamp={selectedRamp}
        reports={reports}
        setSelectedRamp={setSelectedRamp}
      />
    </div>
  );
}
