# Puget Sound Creel Reports

Interactive map-based viewer for Puget Sound creel (angler survey) reports.

This repository is a **frontend-only Next.js app**. It consumes an external reports API and overlays those reports on a Mapbox map with Washington marine area boundaries.

## Links

- Live app: [pscreelreports.com](https://pscreelreports.com)
- Backend/API repository: [github.com/thomas-basham/ps-creel-api](https://github.com/thomas-basham/ps-creel-api)

## Problem This Project Solves

Creel report data is useful but hard to interpret quickly in raw table form. Anglers and planners usually need to answer questions like:

- Where are fish being caught right now?
- Which boat ramps have recent activity?
- What species are being caught at a given launch site?

This app solves that by putting reports directly on a map and summarizing catch data per ramp.

## How The App Solves It

- Fetches recent creel reports from a configurable API (`NEXT_PUBLIC_REPORTS_API_URL`).
- Fetches marine area geometry from WDFW ArcGIS (public GeoJSON endpoint).
- Groups reports by `Ramp_site` and places ramp markers using ramp coordinates.
- Opens a ramp detail panel with:
  - total fish caught (combined + by species)
  - report count
  - individual report details (date, anglers, catch area, species)
- Supports marine area hover/click interactions to show area number/name.
- Shows an on-map date range summary for the loaded report set.

## Current Architecture

- **Framework:** Next.js App Router (client-rendered map experience)
- **Main page:** `src/app/page.js`
- **Data hooks:** `src/hooks/useReports.js` (SWR + Axios)
- **Map + interactions:** `src/components/MapDisplay.jsx`
- **Marine boundaries source:** WDFW ArcGIS REST query endpoint
- **Ramp details UI:** `src/components/RampReports.jsx`, `src/components/ReportCard.jsx`

## Tech Stack

- Next.js 15
- React 19
- `react-map-gl` + `mapbox-gl`
- SWR + Axios
- Lodash (`groupBy`)
- Tailwind CSS v4

## Data Sources

- **Creel reports API (required):**
  - powered by `ps-creel-api` (ETL + Express + Prisma over WDFW CSV data)
  - `GET {NEXT_PUBLIC_REPORTS_API_URL}/reports?limit=10000`
  - `GET {NEXT_PUBLIC_REPORTS_API_URL}/reports/date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Marine area polygons (public):**
  - WDFW ArcGIS Marine Areas service (GeoJSON query)

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_MAPBOX_API_KEY=pk.your_mapbox_token_here
NEXT_PUBLIC_REPORTS_API_URL=https://your-reports-api.example.com
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - run local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Expected Report Shape

The UI currently expects report fields including:

- `Ramp_site`
- `sample_date_parsed` and/or `Sample_date`
- `Anglers`
- `Catch_area`
- species counts (`Chinook`, `Coho`, `Chum`, `Pink`, `Sockeye`, `Lingcod`, `Halibut`)
- nested ramp coordinates: `ramps.latitude`, `ramps.longitude`

## Notes And Limitations

- Temporary: the default date range start is hardcoded in `src/app/page.js` (`2025-06-01` to today).
- The app depends on external services (reports API, Mapbox, WDFW ArcGIS).
- This repo does not include the reports backend service.
