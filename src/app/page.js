"use client";

import { useState } from "react";

import FullScreenLoader from "@/components/FullScreenLoader";
import MapDisplay from "@/components/MapDisplay";
import { useAllReports, useReportsByDate } from "@/hooks/useReports";

const briefingPoints = [
  "This map plots fishing survey reports across Puget Sound. Open a marine area for region-level totals, or a ramp beacon to isolate a single launch site.",
  "Marine areas brighten as you scan over them, then lock into a report drawer once selected.",
  "Beacon markers are launch ramps. Each badge shows how many reports are tied to that site.",
  "The report drawer aggregates catch, anglers, and species before drilling into individual survey dates.",
];

const formatDate = (
  value,
  options = { month: "short", day: "numeric", year: "numeric" }
) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export default function Home() {
  const [briefingOpen, setBriefingOpen] = useState(false);

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
        <div className="absolute inset-0 creel-loader-grid opacity-35" />
        <div className="creel-surface-strong relative z-10 w-full max-w-xl rounded-[1.75rem] p-7 text-center sm:rounded-[2rem] sm:p-10">
          <p className="creel-eyebrow text-cyan-100/60">Signal Interrupted</p>
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Error loading date-filtered reports
          </h1>
          <p className="mt-5 text-base leading-7 text-cyan-50/70">
            The dashboard could not finish its latest sync. Check the reports
            API and refresh the page to try again.
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03111b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(87,190,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(7,95,145,0.32),_transparent_34%),linear-gradient(135deg,_#01060b_6%,_#072238_48%,_#01050a_100%)]" />
      <div className="absolute inset-0 creel-loader-grid opacity-30" />
      <div className="creel-loader-glow absolute left-[20%] top-[18%] h-[30rem] w-[30rem] rounded-full opacity-80" />
      <div
        className="creel-loader-glow absolute left-[82%] top-[72%] h-[22rem] w-[22rem] rounded-full opacity-70"
        style={{ animationDelay: "-2.4s" }}
      />

      <main className="creel-section-gap creel-safe-inline relative z-10 mx-auto flex min-h-screen w-full max-w-[126rem] flex-col py-4 sm:py-5">
        {/* From `lg` up the header and map together fill exactly one viewport so
            the plot reads as the primary surface and the copy below sits past
            the fold. The subtracted rem matches this element's vertical
            padding. */}
        <div className="creel-section-gap flex flex-col lg:h-[calc(100svh-2.5rem)] lg:min-h-[34rem]">
          <header className="creel-surface shrink-0 rounded-[1.75rem] p-5 sm:rounded-[2rem] lg:rounded-[1.5rem] lg:p-3 xl:p-3.5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <div className="space-y-3 lg:space-y-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2.5 lg:gap-2.5 lg:px-3.5 lg:py-2">
                  <span className="creel-loader-dot h-2 w-2 shrink-0 rounded-full bg-cyan-100" />
                  <span className="creel-label text-cyan-50/75">
                    Live Marine Dashboard
                  </span>
                </div>
                {/* The heading shares a row with the metrics from `lg` up, so it
                    steps up only once there is width to keep it on one line. */}
                <h1 className="text-2xl font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-3xl lg:whitespace-nowrap lg:text-2xl 2xl:text-3xl min-[2200px]:text-4xl">
                  Explore the Sound creel data in a new way.
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:w-auto lg:gap-2.5">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="creel-metric-card flex flex-col justify-between gap-1.5 rounded-[1.1rem] px-3.5 py-3 sm:rounded-[1.25rem] sm:px-4 sm:py-3.5 lg:min-w-[6.5rem] lg:gap-0.5 lg:rounded-[0.9rem] lg:px-3 lg:py-2 xl:min-w-[7.25rem]"
                  >
                    <p className="creel-label text-cyan-100/55 lg:text-[0.68rem] lg:tracking-[0.12em]">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold tracking-[-0.03em] text-white tabular-nums sm:text-xl lg:text-base xl:text-lg">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <MapDisplay reports={reportList} />
        </div>

        <section className="grid grid-cols-1 gap-[inherit] xl:grid-cols-2">
          <div className="creel-surface rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-8">
            <p className="creel-eyebrow text-cyan-100/55">Puget Sound Creel</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-cyan-50/72 sm:leading-8">
              This map turns survey reports into a single command deck for
              launch ramps, marine areas, and catch totals. Scan the water, open
              a zone, and inspect each sampling date like a live radar trace.
            </p>
          </div>

          <aside className="creel-surface-strong rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-7 xl:p-8">
            <div className="flex h-full flex-col gap-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="creel-label text-cyan-100/55">
                      Mission Briefing
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                      Read the water fast.
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBriefingOpen((open) => !open)}
                    aria-expanded={briefingOpen}
                    className="-mr-1 -mt-1 shrink-0 rounded-full border border-cyan-100/12 bg-white/5 px-4 py-2.5 text-sm font-medium text-cyan-50/80 transition hover:border-cyan-100/30 hover:bg-white/10 hover:text-white xl:hidden"
                  >
                    {briefingOpen ? "Hide" : "How it works"}
                  </button>
                </div>

                <div
                  className={`${
                    briefingOpen ? "space-y-4" : "hidden"
                  } text-base leading-7 text-cyan-50/70 xl:block xl:space-y-4 xl:text-sm xl:leading-7`}
                >
                  {briefingPoints.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-cyan-100/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[1.5rem] xl:mt-auto">
                <p className="creel-label text-cyan-100/55">Active Window</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.01em] text-white">
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
        </section>
      </main>
    </div>
  );
}
