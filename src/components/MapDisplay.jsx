// src/components/MapDisplay.jsx
"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Map, { NavigationControl, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import _ from "lodash";

import MarineAreaBoundaries from "./MarineAreaBoundaries";
import RampMarkers from "./RampMarkers";
import RampReports from "./RampReports";

const normalizeAreaNumber = (value) => {
  if (value === null || value === undefined) return null;
  const match = String(value).trim().match(/\d+/);
  return match ? match[0] : null;
};

const formatRangeDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function MapDisplay({ reports }) {
  const mapRef = useRef(null);
  const reportList = useMemo(
    () => (Array.isArray(reports) ? reports : []),
    [reports]
  );
  const [viewport, setViewport] = useState({
    latitude: 47.8562,
    longitude: -123.3321,
    zoom: 8,
  });
  const [selectedReportSet, setSelectedReportSet] = useState(null);
  const [areaInfo, setAreaInfo] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const groupedReports = useMemo(
    () => _.groupBy(reportList, "Ramp_site"),
    [reportList]
  );
  const reportCount = reportList.length;
  const rampCount = Object.keys(groupedReports).length;
  const areaCount = useMemo(
    () =>
      new Set(
        reportList
          .map((report) => normalizeAreaNumber(report?.Catch_area))
          .filter(Boolean)
      ).size,
    [reportList]
  );

  const handleMarkerClick = useCallback(
    (rampSite) => {
      setAreaInfo(null);
      setSelectedReportSet({
        title: rampSite || "Unnamed Ramp",
        subtitle: "Ramp site",
        reports: groupedReports[rampSite] || [],
      });
    },
    [groupedReports]
  );

  const reportDateRange = useMemo(() => {
    if (!reportList.length) return "No reports available";

    const timestamps = reportList
      .map(
        (report) =>
          new Date(report?.sample_date_parsed ?? report?.Sample_date ?? "").getTime()
      )
      .filter((value) => Number.isFinite(value));

    if (!timestamps.length) return "Date range unavailable";

    const bounds = timestamps.reduce(
      (accumulator, timestamp) => ({
        earliest: Math.min(accumulator.earliest, timestamp),
        latest: Math.max(accumulator.latest, timestamp),
      }),
      {
        earliest: timestamps[0],
        latest: timestamps[0],
      }
    );

    return `${formatRangeDate(bounds.latest)} - ${formatRangeDate(
      bounds.earliest
    )}`;
  }, [reportList]);

  const focusLabel = selectedReportSet
    ? `${selectedReportSet.title}${
        selectedReportSet.subtitle ? ` - ${selectedReportSet.subtitle}` : ""
      }`
    : "Select a marine area or ramp to inspect survey details";

  return (
    <div className="relative w-full flex-1">
      <div className="creel-surface-strong relative overflow-hidden rounded-[2rem] p-2 sm:p-3">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(83,196,255,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_24%,_rgba(0,0,0,0.18)_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-cyan-100/10 bg-[#03131f]/72 px-4 py-2 backdrop-blur-xl">
              <span className="creel-loader-dot h-2 w-2 rounded-full bg-cyan-100" />
              <span className="text-[0.68rem] font-medium uppercase tracking-[0.4em] text-cyan-50/72">
                Live Survey Plot
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-cyan-100/10 bg-[#03131f]/72 px-4 py-2 text-sm text-cyan-50/80 backdrop-blur-xl">
                Reports from: {reportDateRange}
              </div>
              <div className="rounded-full border border-cyan-100/10 bg-[#03131f]/72 px-4 py-2 text-sm text-cyan-50/80 backdrop-blur-xl">
                {reportCount.toLocaleString()} reports tracked
              </div>
              <div className="rounded-full border border-cyan-100/10 bg-[#03131f]/72 px-4 py-2 text-sm text-cyan-50/80 backdrop-blur-xl">
                {rampCount.toLocaleString()} ramp beacons
              </div>
              <div className="rounded-full border border-cyan-100/10 bg-[#03131f]/72 px-4 py-2 text-sm text-cyan-50/80 backdrop-blur-xl">
                {areaCount.toLocaleString()} marine sectors
              </div>
            </div>
          </div>

          <div className="max-w-sm rounded-[1.5rem] border border-cyan-100/10 bg-[#03131f]/78 px-4 py-3 backdrop-blur-xl">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
              Active Focus
            </p>
            <p className="mt-2 text-sm leading-6 text-cyan-50/82">
              {focusLabel}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-100/10">
          <div className="relative h-[68vh] min-h-[34rem] w-full">
            <Map
              ref={mapRef}
              {...viewport}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
              onMoveEnd={(evt) => setViewport(evt.viewState)}
              interactiveLayerIds={["marine-fill"]}
              onMouseMove={(evt) => {
                const feature = evt.features?.find(
                  (currentFeature) => currentFeature.layer.id === "marine-fill"
                );
                const newId = feature?.id ?? null;

                if (hoveredId !== newId) {
                  if (hoveredId !== null) {
                    mapRef.current
                      .getMap()
                      .setFeatureState(
                        { source: "marine-areas", id: hoveredId },
                        { hover: false }
                      );
                  }

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
              onClick={(evt) => {
                const feature = evt.features?.find(
                  (currentFeature) => currentFeature.layer.id === "marine-fill"
                );

                if (feature) {
                  const [lng, lat] = evt.lngLat.toArray();
                  const areaNumber = normalizeAreaNumber(
                    feature.properties?.maNumber
                  );
                  const areaReports = areaNumber
                    ? reportList.filter(
                        (report) =>
                          normalizeAreaNumber(report?.Catch_area) === areaNumber
                      )
                    : [];

                  setAreaInfo({ lngLat: [lng, lat], props: feature.properties });
                  setSelectedReportSet({
                    title: areaNumber ? `Area ${areaNumber}` : "Selected Area",
                    subtitle: feature.properties?.maName || null,
                    reports: areaReports,
                  });
                }
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <NavigationControl position="bottom-right" />

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
                  className="creel-map-popup pointer-events-auto"
                  onClose={() => setAreaInfo(null)}
                  anchor="bottom"
                  offset={[0, -12]}
                >
                  <div className="p-4">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
                      Marine Area
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
                      Area {areaInfo.props.maNumber}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-cyan-50/70">
                      {areaInfo.props.maName}
                    </p>
                  </div>
                </Popup>
              )}
            </Map>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#020b12] via-[#020b12]/48 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-xs rounded-[1.5rem] border border-cyan-100/10 bg-[#03131f]/74 px-4 py-3 backdrop-blur-xl">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
                Scan Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-50/72">
                Click glowing marine sectors to inspect their catch reports, or
                tap a beacon marker to isolate one launch ramp.
              </p>
            </div>
          </div>
        </div>

        <RampReports
          selectedReportSet={selectedReportSet}
          setSelectedReportSet={setSelectedReportSet}
        />
      </div>
    </div>
  );
}
