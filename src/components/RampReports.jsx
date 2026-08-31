"use client";

import { useEffect, useState } from "react";

import ReportCard from "./ReportCard";
import YearCompare from "./YearCompare";

export default function RampReports({
  selectedReportSet,
  setSelectedReportSet,
}) {
  const [activeView, setActiveView] = useState("current");
  const [collapsed, setCollapsed] = useState(false);

  const selectionKey = selectedReportSet
    ? `${selectedReportSet.compare?.scope ?? ""}:${
        selectedReportSet.compare?.name ??
        selectedReportSet.compare?.areaNumber ??
        selectedReportSet.title ??
        ""
      }`
    : null;

  useEffect(() => {
    setActiveView("current");
    setCollapsed(false);
  }, [selectionKey]);

  if (!selectedReportSet) return null;

  const selectedReports = selectedReportSet.reports || [];
  const canCompare = Boolean(selectedReportSet.compare);

  // Calculate total fish caught by species for the current selection.
  const getTotalSpeciesCaught = (reportSet) => {
    const totalFish = {
      Chinook: 0,
      Coho: 0,
      Chum: 0,
      Pink: 0,
      Sockeye: 0,
      Lingcod: 0,
      Halibut: 0,
    };

    reportSet.forEach((report) => {
      totalFish.Chinook += report.Chinook || 0;
      totalFish.Coho += report.Coho || 0;
      totalFish.Chum += report.Chum || 0;
      totalFish.Pink += report.Pink || 0;
      totalFish.Sockeye += report.Sockeye || 0;
      totalFish.Lingcod += report.Lingcod || 0;
      totalFish.Halibut += report.Halibut || 0;
    });

    return totalFish;
  };
  const getTotalFishCaught = (totalFish) => {
    return (
      totalFish.Chinook +
      totalFish.Coho +
      totalFish.Chum +
      totalFish.Pink +
      totalFish.Sockeye +
      totalFish.Lingcod +
      totalFish.Halibut
    );
  };

  const totalSpeciesCaught = getTotalSpeciesCaught(selectedReports);
  const totalFishCaught = getTotalFishCaught(totalSpeciesCaught);
  const totalAnglers = selectedReports.reduce(
    (sum, report) => sum + Number(report.Anglers || 0),
    0,
  );
  const speciesEntries = Object.entries(totalSpeciesCaught).filter(
    ([, total]) => total > 0,
  );
  const summaryItems = [
    {
      label: "Reports",
      value: selectedReports.length.toLocaleString(),
    },
    {
      label: "Anglers",
      value: totalAnglers.toLocaleString(),
    },
    {
      label: "Fish",
      value: totalFishCaught.toLocaleString(),
    },
  ];

  return (
    // Up to `md` this is pinned to the viewport as a bottom sheet, so it stays
    // reachable no matter where the reader has scrolled the page. From `md` up
    // it docks inside the map frame as a side panel, sized so it never eats
    // more than roughly half the map.
    <div className="fixed inset-x-0 bottom-0 z-30 md:absolute md:inset-x-auto md:bottom-4 md:left-4 md:top-16 md:z-20 md:flex md:w-[38%] md:min-w-[20rem] md:max-w-[30rem] md:flex-col md:justify-end lg:w-[32%] xl:w-[28%]">
      {/* The docked panel is bounded by the map frame itself, so it scales with
          the map at any height, fullscreen included, and can never grow past
          the top of the frame. Its width tracks the frame instead of a fixed
          column so the map keeps the same share of the surface on any display. */}
      <div className="creel-surface-strong flex max-h-[88svh] flex-col overflow-hidden rounded-t-[1.75rem] md:max-h-full md:rounded-[1.5rem]">
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={
            collapsed ? "Expand report drawer" : "Collapse report drawer"
          }
          className="creel-sheet-handle w-full shrink-0 py-3.5 md:hidden"
        />

        {/* Below `md` this wrapper is the single scroll surface, so the summary
            header scrolls out of the way and the report cards can use the whole
            sheet. From `md` up it turns back into a flex column with a pinned
            header and an inner scrolling list. */}
        <div className="creel-scrollbar min-h-0 flex-1 overflow-y-auto md:flex md:flex-col md:overflow-visible">
          <div className="shrink-0 border-b border-cyan-100/10 px-5 pb-4 pt-1 sm:px-6 sm:pb-5 md:px-3.5 md:pb-3.5 md:pt-3">
            <div className="flex items-start justify-between gap-4 md:gap-3">
              <div className="min-w-0">
                <p className="creel-label text-cyan-100/55 md:text-[0.62rem]">
                  Selection Lock
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl md:mt-1 md:text-base">
                  {selectedReportSet.title}
                </h2>
                {selectedReportSet.subtitle && (
                  <p className="mt-2 text-sm leading-6 text-cyan-50/70 md:mt-0.5 md:text-xs md:leading-4">
                    {selectedReportSet.subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label="Close report drawer"
                className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-100/12 bg-white/5 text-cyan-50/75 transition hover:border-cyan-100/30 hover:bg-white/10 hover:text-white md:-mr-0.5 md:h-7 md:w-7"
                onClick={() => setSelectedReportSet(null)}
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3 md:mt-2.5 md:gap-1.5">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="creel-metric-card rounded-[1.1rem] px-3 py-2.5 sm:rounded-[1.2rem] sm:px-4 sm:py-4 md:rounded-[0.75rem] md:px-2 md:py-1.5"
                >
                  <p className="creel-label text-cyan-100/50 md:text-[0.62rem]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white tabular-nums sm:mt-2 sm:text-xl md:mt-0.5 md:text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {speciesEntries.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-2 md:mt-2.5 md:gap-1">
                {speciesEntries.map(([species, total]) => (
                  <div
                    key={species}
                    className="rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-2 text-sm text-cyan-50/80 md:px-2 md:py-0.5 md:text-[0.68rem]"
                  >
                    <span className="font-medium text-white">{species}</span>{" "}
                    {total.toLocaleString()}
                  </div>
                ))}
              </div>
            )}

            {canCompare && (
              <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-full border border-cyan-100/10 bg-white/5 p-1.5 md:mt-2.5 md:gap-1 md:p-0.5">
                {[
                  { id: "current", label: "Current" },
                  { id: "compare", label: "Compare years" },
                ].map((tab) => {
                  const isActive = activeView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveView(tab.id)}
                      aria-pressed={isActive}
                      className={`rounded-full px-3 py-2.5 text-sm font-medium transition md:py-1 md:text-[0.68rem] ${
                        isActive
                          ? "bg-cyan-100/90 text-[#03111b]"
                          : "text-cyan-50/70 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className={`creel-scrollbar creel-safe-bottom px-5 pt-5 sm:px-6 sm:pt-6 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-3 md:pb-3 md:pt-3 ${
              collapsed ? "hidden md:block" : ""
            }`}
          >
            {activeView === "compare" && canCompare ? (
              <YearCompare compare={selectedReportSet.compare} />
            ) : selectedReports.length > 0 ? (
              <ul className="space-y-3.5 md:space-y-2">
                {selectedReports.map((report, idx) => (
                  <ReportCard key={idx} report={report} />
                ))}
              </ul>
            ) : (
              <div className="rounded-[1.4rem] border border-cyan-100/10 bg-white/5 px-5 py-6 text-sm leading-7 text-cyan-50/70">
                No reports were found for this selection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
