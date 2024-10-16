# WDFW Creel Reports Map Application

This web application fetches fishing report data from the **Washington Department of Fish and Wildlife (WDFW) Creel Reports** page and displays it on an interactive map. The app aims to make it easier for anglers to visualize fishing ramp data, such as total fish caught, species breakdown, and the number of anglers.

## Features

- **Interactive Map** using Mapbox, displaying ramps and fishing reports.
- Aggregated data showing:
  - **Total fish caught** (by species and overall).
  - **Anglers** involved in the reports.
  - Fishing data is grouped by **ramp site**.
- **Date range** display showing the period of reports available.
- Responsive design for mobile and desktop.

## Tech Stack

- **Next.js**: Server-side rendering and static site generation.
- **React**: Frontend library.
- **Mapbox GL**: Interactive mapping.
- **Tailwind CSS**: Utility-first CSS for styling.
- **Lodash**: JavaScript library for manipulating and grouping data.
- **Axios**: (Optional) If you plan to fetch data from an external API.

## Data Source

The data is fetched from the **WDFW Creel Reports** page, which provides detailed fishing reports for various ramp sites in Washington. The app processes this data and presents it in a user-friendly way, focusing on the total catches by species and the number of anglers per report.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/wdfw-creel-reports-map.git
   cd wdfw-creel-reports-map
   ```

Install dependencies:

bash

npm install

or

bash

yarn install

Set up environment variables:

Create a .env.local file in the root of your project and add your Mapbox API key:

bash

NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_access_token

Run the development server:

bash

npm run dev

or

    yarn dev

Visit <http://localhost:3000> to view your app.

Deployment

To deploy the app:

Build the project:

    npm run build

or

    yarn build

Start the production server:

    npm run start

or

    yarn start

Alternatively, you can deploy it on platforms like Vercel or Netlify.
Features & Functionality
Fetching WDFW Creel Reports Data

The app pulls fishing reports data from the WDFW Creel Reports page, processes it, and visualizes the data on a map. The app allows users to easily digest fishing reports by:

    Visualizing ramps on a map.
    Displaying total fish caught per ramp site, grouped by species.
    Showing the number of anglers and other relevant report details.

Map Visualization

    The Mapbox GL map plots fishing ramps as markers.
    Clicking on a marker reveals detailed fishing reports for that ramp.
    The map displays a date range showing the time period of the reports.

Date Range Display

A pill-like UI element displays the range of dates for the available reports at the top of the map. This helps users quickly understand the time frame for which reports are available.
Responsive Design

The application is styled using Tailwind CSS, making it fully responsive and optimized for both desktop and mobile use.
File Structure

```perl
wdfw-creel-reports-map/
├── public/ # Public assets (images, icons)
├── src/
│ ├── app/ # Next.js app directory
│ ├── components/ # Reusable components
│ ├── hooks/ # Custom React hooks
│ └── pages/ # Next.js pages and routing
├── styles/ # Global and Tailwind CSS styles
├── .env.local # Environment variables (Mapbox API key)
├── README.md # Project documentation
├── package.json # Project configuration and dependencies
└── tailwind.config.js # Tailwind CSS configuration
```

Future Enhancements

    Advanced filtering: Add the ability to filter reports by species, anglers, or date range.
    Data fetching automation: Automate the process of fetching new data from the WDFW Creel Reports page.
    Report download: Enable users to export reports in CSV or PDF format for offline use.

License

This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgements

    WDFW for providing the Creel Reports.
    Mapbox for map visualization.
    Tailwind CSS for styling.
    Lodash for data manipulation.
