"use client";

import FullScreenLoader from "@/components/FullScreenLoader";
import MapDisplay from "@/components/MapDisplay";
import { useAllReports, useReportsByDate } from "@/hooks/useReports";

const formatDate = (
  value,
  options = { month: "short", day: "numeric", year: "numeric" }
) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export default function Home() {
  const selectedDateRange = {
    pastDate: "2024-01-01",
    recentDate: new Date().toISOString().split("T")[0],
  };

  const { allReportsData } = useAllReports();

  const { reportsByDateData, reportsByDateLoading, reportsByDateError } =
    useReportsByDate(selectedDateRange.pastDate, selectedDateRange.recentDate);

  const reportList = Array.isArray(reportsByDateData)
    ? reportsByDateData
    : Array.isArray(allReportsData)
      ? allReportsData
      : [];

  const uniqueRamps = new Set(
    reportList.map((report) => report?.Ramp_site).filter(Boolean)
  ).size;
  const uniqueAreas = new Set(
    reportList
      .map((report) => String(report?.Catch_area ?? "").trim())
      .filter(Boolean)
  ).size;
  const latestSampleTimestamp = reportList.reduce((latest, report) => {
    const timestamp = new Date(
      report?.sample_date_parsed ?? report?.Sample_date ?? ""
    ).getTime();

    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, 0);
  const latestReportLabel = latestSampleTimestamp
    ? formatDate(latestSampleTimestamp)
    : "Syncing";
  const summaryItems = [
    {
      label: "Reports Plotted",
      value: reportList.length.toLocaleString(),
    },
    {
      label: "Launch Ramps",
      value: uniqueRamps.toLocaleString(),
    },
    {
      label: "Marine Areas",
      value: uniqueAreas.toLocaleString(),
    },
    {
      label: "Latest Sample",
      value: latestReportLabel,
    },
  ];

  if (reportsByDateLoading) return <FullScreenLoader />;

  if (reportsByDateError)
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03111b] px-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,190,255,0.18),_transparent_34%),linear-gradient(135deg,_#01060b_6%,_#072238_48%,_#01050a_100%)]" />
        <div className="creel-loader-grid absolute inset-0 opacity-35" />
        <div className="creel-surface-strong relative z-10 max-w-xl rounded-[2rem] p-8 text-center">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.5em] text-cyan-100/60">
            Signal Interrupted
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            Error loading date-filtered reports
          </h1>
          <p className="mt-4 text-sm leading-7 text-cyan-50/70">
            The dashboard could not finish its latest sync. Check the reports
            API and refresh the page to try again.
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03111b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,190,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(7,95,145,0.32),_transparent_34%),linear-gradient(135deg,_#01060b_6%,_#072238_48%,_#01050a_100%)]" />
      <div className="creel-loader-grid absolute inset-0 opacity-30" />
      <div className="creel-loader-glow absolute left-[20%] top-[18%] h-[30rem] w-[30rem] rounded-full opacity-80" />
      <div
        className="creel-loader-glow absolute left-[82%] top-[72%] h-[22rem] w-[22rem] rounded-full opacity-70"
        style={{ animationDelay: "-2.4s" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[92rem] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
        <header className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="creel-surface rounded-[2rem] p-6 sm:p-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2">
              <span className="creel-loader-dot h-2 w-2 rounded-full bg-cyan-100" />
              <span className="text-[0.72rem] font-medium uppercase tracking-[0.45em] text-cyan-50/72">
                Live Marine Dashboard
              </span>
            </div>

            <div className="mt-6 max-w-4xl space-y-4">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.65em] text-cyan-100/55">
                Puget Sound Creel
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl xl:text-[3.65rem]">
                Explore the Sound through a night-watch creel display.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-cyan-50/72 sm:text-base">
                This map turns survey reports into a single command deck for
                launch ramps, marine areas, and catch totals. Hover the water,
                click a zone, and inspect each sampling date like a live radar
                trace.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="creel-metric-card rounded-[1.5rem] px-4 py-4"
                >
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="creel-surface-strong rounded-[2rem] p-6 sm:p-7">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.45em] text-cyan-100/55">
                  Mission Briefing
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  Read the water fast.
                </h2>
                <div className="space-y-3 text-sm leading-7 text-cyan-50/68">
                  <p>
                    Marine areas brighten when you scan over them, then lock
                    into a report drawer when selected.
                  </p>
                  <p>
                    Beacon markers represent launch ramps. Each badge shows how
                    many reports are tied to that site.
                  </p>
                  <p>
                    The report panel aggregates total catch, anglers, and
                    species breakdowns before drilling into individual survey
                    dates.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-100/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
                  Active Window
                </p>
                <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-white">
                  {formatDate(selectedDateRange.pastDate)} -{" "}
                  {formatDate(selectedDateRange.recentDate)}
                </p>
                <p className="mt-3 text-sm leading-6 text-cyan-50/60">
                  Latest sampled report in the current payload:{" "}
                  <span className="font-medium text-cyan-50/82">
                    {latestReportLabel}
                  </span>
                </p>
              </div>
            </div>
          </aside>
        </header>

        <div className="absolute right-8 top-8 hidden xl:block">
          <div className="relative group">
            <button
              type="button"
              aria-label="About this app"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100/10 bg-[#041625]/82 text-sm font-semibold text-cyan-50 shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            >
              i
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full z-20 mt-3 w-80 rounded-[1.5rem] border border-cyan-100/10 bg-[#041625]/94 px-4 py-4 text-sm leading-7 text-cyan-50/72 opacity-0 shadow-[0_22px_55px_rgba(0,0,0,0.35)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <p>
                This app maps fishing survey reports across Puget Sound. Click a
                marine area for region-level reports or tap a ramp beacon to see
                one launch site.
              </p>
            </div>
          </div>
        </div>

        <MapDisplay reports={reportList} />
      </div>
    </div>
  );
}
