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

  // static color mapping stays the same
  const fillColor = [
    "match",
    ["get", "maNumber"],
    "1",
    "#fee5d9",
    "2",
    "#fcbba1",
    "3",
    "#fc9272",
    "4",
    "#fb6a4a",
    "5",
    "#ef3b2c",
    "6",
    "#cb181d",
    "7",
    "#a50f15",
    "8",
    "#67000d",
    "9",
    "#edf8e9",
    "10",
    "#bae4b3",
    "11",
    "#74c476",
    "12",
    "#31a354",
    "13",
    "#006d2c",
    /* default */ "#ccc",
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
            0.99, // opacity when hovered
            0.4, // default opacity
          ],
        }}
      />
      <Layer
        id="marine-outline"
        type="line"
        paint={{
          "line-color": "#004DA8",
          "line-width": 2,
        }}
      />
    </Source>
  );
}
