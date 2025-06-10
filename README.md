# Puget Sound Creel Reports

A full-stack web application that aggregates and visualizes boat-ramp creel (angler survey) data across Puget Sound. The backend is built with Express, Prisma (PostgreSQL), and deployed on Vercel. The frontend uses React, Mapbox GL, Tailwind CSS, and displays interactive maps with marine area boundaries, ramp markers, and popups.

---

## Features

- **Interactive Map**: Displays fishing areas (1–13) color-coded by zone.
- **Hover & Click**: Marine areas darken on hover and show detailed popups on click.
- **Ramp Markers**: Custom SVG/emoji icons mark boat ramps; clicking opens a report list.
- **Creel Reports**: Backend API endpoints (`/reports`) serve water sampling data.
- **Date Range Filter**: Frontend header shows current data date range.

---

## Tech Stack

- **Frontend**

  - React 18
  - Mapbox GL
  - Tailwind CSS
  - Lodash for data grouping

- **Backend**

  - Node.js & Express
  - Prisma ORM (PostgreSQL)

---

## Getting Started

### Prerequisites

- Node.js (>=16.x)
- npm or Yarn
- A Mapbox account (for access token)
- PostgreSQL database (e.g. Supabase, AWS Aurora)

### Environment Variables

Create a `.env` file in both `/api` and `/app` directories (or root):

```
# Backend (/api/.env)
DATABASE_URL="postgres://USER:PASS@HOST:PORT/DB?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgres://USER:PASS@HOST:5432/DB"

# Frontend (/app/.env)
NEXT_PUBLIC_MAPBOX_API_KEY=pk.your_mapbox_token_here
NEXT_PUBLIC_MAPBOX_API_KEY_NAME=YOUR_MAPBOX_TOKEN
CLIENT_URL=http://localhost:3000
```

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/foo`)
3. Commit your changes (`git commit -am 'Add foo'`)
4. Push to the branch (`git push origin feature/foo`)
5. Open a Pull Request

---

## License

MIT © Your Name
