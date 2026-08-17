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
    0
  );
  const speciesEntries = Object.entries(totalSpeciesCaught).filter(
    ([, total]) => total > 0
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
    <div className="fixed inset-x-0 bottom-0 z-30 md:absolute md:inset-x-auto md:bottom-6 md:left-6 md:z-20 md:w-[21rem] lg:w-[25rem] xl:w-[28rem]">
      {/* The docked cap is tied to the map's own height so the panel can never
          grow past the top of the map frame. */}
      <div className="creel-surface-strong flex max-h-[80svh] flex-col overflow-hidden rounded-t-[1.75rem] md:max-h-[calc(64vh-1.5rem)] md:rounded-[1.75rem] lg:max-h-[calc(68vh-1.5rem)]">
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={
            collapsed ? "Expand report drawer" : "Collapse report drawer"
          }
          className="creel-sheet-handle w-full shrink-0 py-3.5 md:hidden"
        />

        <div className="shrink-0 border-b border-cyan-100/10 px-5 pb-6 pt-1 sm:px-6 sm:pb-7 md:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="creel-label text-cyan-100/55">Selection Lock</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {selectedReportSet.title}
              </h2>
              {selectedReportSet.subtitle && (
                <p className="mt-2 text-sm leading-6 text-cyan-50/70">
                  {selectedReportSet.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label="Close report drawer"
              className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-100/12 bg-white/5 text-cyan-50/75 transition hover:border-cyan-100/30 hover:bg-white/10 hover:text-white"
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

          <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="creel-metric-card rounded-[1.1rem] px-3 py-3.5 sm:rounded-[1.2rem] sm:px-4 sm:py-4"
              >
                <p className="creel-label text-cyan-100/50">{item.label}</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white tabular-nums sm:text-xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {speciesEntries.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {speciesEntries.map(([species, total]) => (
                <div
                  key={species}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-2 text-sm text-cyan-50/80"
                >
                  <span className="font-medium text-white">{species}</span>{" "}
                  {total.toLocaleString()}
                </div>
              ))}
            </div>
          )}

          {canCompare && (
            <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-full border border-cyan-100/10 bg-white/5 p-1.5">
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
                    className={`rounded-full px-3 py-2.5 text-sm font-medium transition ${
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
          className={`creel-scrollbar creel-safe-bottom flex-1 overflow-y-auto px-5 pt-5 sm:px-6 sm:pt-6 ${
            collapsed ? "hidden md:block" : ""
          }`}
        >
          {activeView === "compare" && canCompare ? (
            <YearCompare compare={selectedReportSet.compare} />
          ) : selectedReports.length > 0 ? (
            <ul className="space-y-3.5">
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
  );
}
