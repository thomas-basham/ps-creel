// src/components/MapDisplay.jsx
"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
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

// Touch devices get Mapbox's cooperative gestures so a one-finger swipe scrolls
// the page instead of panning the map out from under the reader.
const prefersCooperativeGestures = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

export default function MapDisplay({ reports }) {
  const mapRef = useRef(null);
  const frameRef = useRef(null);
  const [cooperativeGestures] = useState(prefersCooperativeGestures);
  // `fullscreen` tracks the native Fullscreen API; `fallbackExpanded` is the
  // in-page overlay used where that API is unavailable (notably iOS Safari).
  const [fullscreen, setFullscreen] = useState(false);
  const [fallbackExpanded, setFallbackExpanded] = useState(false);
  const expanded = fullscreen || fallbackExpanded;
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
  const handleMarkerClick = useCallback(
    (rampSite) => {
      setAreaInfo(null);
      setSelectedReportSet({
        title: rampSite || "Unnamed Ramp",
        subtitle: "Ramp site",
        reports: groupedReports[rampSite] || [],
        compare: rampSite ? { scope: "ramp", name: rampSite } : null,
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

    return `${formatRangeDate(bounds.earliest)} - ${formatRangeDate(
      bounds.latest
    )}`;
  }, [reportList]);

  const focusLabel = selectedReportSet
    ? `${selectedReportSet.title}${
        selectedReportSet.subtitle ? ` - ${selectedReportSet.subtitle}` : ""
      }`
    : "Select a marine area or ramp to inspect survey details";

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const isNativeFullscreen =
      document.fullscreenElement || document.webkitFullscreenElement;

    if (isNativeFullscreen) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }

    const request = frame.requestFullscreen || frame.webkitRequestFullscreen;

    if (request) {
      request.call(frame);
    } else {
      // No Fullscreen API (iOS Safari): fall back to an in-page fixed overlay.
      setFallbackExpanded((value) => !value);
    }
  }, []);

  // Keep local state in sync with the browser so the Escape key and native
  // fullscreen chrome flip the button back without our intervention.
  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(
        Boolean(document.fullscreenElement || document.webkitFullscreenElement)
      );
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      document.removeEventListener("webkitfullscreenchange", syncFullscreen);
    };
  }, []);

  // The fallback overlay has no native chrome, so wire up Escape and lock the
  // page scroll behind it.
  useEffect(() => {
    if (!fallbackExpanded) return;

    const onKeyDown = (evt) => {
      if (evt.key === "Escape") setFallbackExpanded(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("creel-map-locked");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("creel-map-locked");
    };
  }, [fallbackExpanded]);

  // Mapbox needs a nudge to re-measure once the frame changes size.
  useEffect(() => {
    const map = mapRef.current?.getMap?.();
    if (!map) return;

    const frame = requestAnimationFrame(() => map.resize());
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  return (
    <div className="relative flex w-full flex-1">
      <div
        ref={frameRef}
        className={`creel-surface-strong relative w-full overflow-hidden ${
          expanded
            ? "fixed inset-0 z-50 flex flex-col rounded-none p-3"
            : "rounded-[1.75rem] p-2 sm:rounded-[2rem] sm:p-3"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(83,196,255,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_24%,_rgba(0,0,0,0.18)_100%)]" />

        {/* Only the survey window lives over the map. The report, ramp, and area
            counts are already in the page header, and repeating them here buried
            the map on small screens. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start gap-2.5 p-4 sm:gap-3 sm:p-5 lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-cyan-100/10 bg-[#03131f]/80 px-3.5 py-2 backdrop-blur-xl">
              <span className="creel-loader-dot h-2 w-2 shrink-0 rounded-full bg-cyan-100" />
              <span className="creel-label text-cyan-50/75">Live Plot</span>
            </div>

            <div className="rounded-full border border-cyan-100/10 bg-[#03131f]/80 px-3.5 py-2 text-sm text-cyan-50/80 backdrop-blur-xl">
              {reportDateRange}
            </div>
          </div>

          <div className="ml-auto flex items-start gap-2.5 sm:gap-3">
            <div className="hidden max-w-sm rounded-[1.25rem] border border-cyan-100/10 bg-[#03131f]/82 px-4 py-3.5 backdrop-blur-xl lg:block">
              <p className="creel-label text-cyan-100/55">Active Focus</p>
              <p className="mt-2 text-sm leading-6 text-cyan-50/82">
                {focusLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-pressed={expanded}
              aria-label={expanded ? "Exit fullscreen" : "Enter fullscreen"}
              className="pointer-events-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-100/10 bg-[#03131f]/80 text-cyan-50/80 backdrop-blur-xl transition hover:border-cyan-100/30 hover:bg-[#03131f] hover:text-white"
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {expanded ? (
                  <path d="M3 7h4V3M17 7h-4V3M17 13h-4v4M3 13h4v4" />
                ) : (
                  <path d="M7 3H3v4M13 3h4v4M13 17h4v-4M7 17H3v-4" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`relative overflow-hidden border border-cyan-100/10 ${
            expanded ? "h-full flex-1 rounded-[1.25rem]" : "rounded-[1.5rem]"
          }`}
        >
          <div
            className={`relative w-full ${
              expanded
                ? "h-full"
                : "h-[70svh] min-h-[26rem] sm:min-h-[30rem] lg:h-[calc(100svh-15rem)] lg:min-h-[38rem]"
            }`}
          >
            <Map
              ref={mapRef}
              {...viewport}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
              cooperativeGestures={cooperativeGestures}
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
                    compare: areaNumber
                      ? { scope: "area", areaNumber }
                      : null,
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
                  <div className="px-5 py-4">
                    <p className="creel-label text-cyan-100/55">Marine Area</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
                      Area {areaInfo.props.maNumber}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-cyan-50/70">
                      {areaInfo.props.maName}
                    </p>
                  </div>
                </Popup>
              )}
            </Map>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#020b12] via-[#020b12]/48 to-transparent sm:h-28" />

            {/* The hint retires once the reader has made a selection, handing the
                bottom of the map back to the report drawer. */}
            {!selectedReportSet && (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-full border border-cyan-100/10 bg-[#03131f]/82 px-4 py-3 text-center backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-xs sm:rounded-[1.5rem] sm:px-5 sm:py-4 sm:text-left">
                <p className="creel-label hidden text-cyan-100/55 sm:block">
                  Scan Notes
                </p>
                <p className="text-sm leading-6 text-cyan-50/75 sm:mt-2">
                  <span className="sm:hidden">
                    Tap a sector or beacon to open reports
                  </span>
                  <span className="hidden sm:inline">
                    Tap a glowing marine sector for its catch reports, or a
                    beacon marker to isolate one launch ramp.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RampReports
        selectedReportSet={selectedReportSet}
        setSelectedReportSet={setSelectedReportSet}
      />
    </div>
  );
}
