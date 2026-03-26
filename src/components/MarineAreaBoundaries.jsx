// src/components/MarineAreaBoundaries.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Source, Layer } from "react-map-gl/mapbox";

export default function MarineAreaBoundaries() {
  const [data, setData] = useState(null);

  const fetchAreas = useCallback(async () => {
    const params = new URLSearchParams({
      where: "1=1",
      outFields: "MACN,maNumber,maName",
      f: "geojson",
    });
    const url =
      "https://geodataservices.wdfw.wa.gov/arcgis/rest/services/" +
      "ApplicationServices/Marine_Areas/MapServer/3/query?" +
      params.toString();

    const res = await fetch(url);
    const raw = await res.json();
    if (raw.features && Array.isArray(raw.features)) {
      setData({
        type: "FeatureCollection",
        features: raw.features.map((f, idx) => ({
          type: "Feature",
          id: parseInt(f.properties.maNumber, 10) || idx, // ← assign a numeric id
          geometry: f.geometry,
          properties: f.properties,
        })),
      });
    } else {
      console.error("Unexpected GeoJSON shape:", raw);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const fillColor = [
    "match",
    ["get", "maNumber"],
    "1",
    "#0a2136",
    "2",
    "#0d2942",
    "3",
    "#11314d",
    "4",
    "#143958",
    "5",
    "#174263",
    "6",
    "#1a4b6f",
    "7",
    "#1d567a",
    "8",
    "#216185",
    "9",
    "#266f90",
    "10",
    "#2d7d9b",
    "11",
    "#358ba6",
    "12",
    "#4799af",
    "13",
    "#5fabc0",
    "#15324a",
  ];

  if (!data) return null;

  return (
    <Source id="marine-areas" type="geojson" data={data}>
      <Layer
        id="marine-fill"
        type="fill"
        paint={{
          "fill-color": fillColor,
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.52,
            0.2,
          ],
        }}
      />
      <Layer
        id="marine-outline-glow"
        type="line"
        paint={{
          "line-color": "#63d7ff",
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.4,
            0.14,
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            6,
            3,
          ],
          "line-blur": 2.5,
        }}
      />
      <Layer
        id="marine-outline"
        type="line"
        paint={{
          "line-color": "#9ee9ff",
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.92,
            0.5,
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2.3,
            1.1,
          ],
        }}
      />
    </Source>
  );
}
