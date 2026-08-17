"use client";

import { useYearCompare } from "@/hooks/useReports";

const STATUS_META = {
  fish_caught: {
    label: "Fish caught",
    dotClass: "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]",
    textClass: "text-emerald-200",
  },
  no_fish: {
    label: "No fish",
    dotClass: "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.85)]",
    textClass: "text-amber-200",
  },
  no_surveys: {
    label: "No surveys",
    dotClass: "bg-cyan-100/35",
    textClass: "text-cyan-50/55",
  },
};

const formatWindow = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const fmt = (date, withYear) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...(withYear ? { year: "numeric" } : {}),
    }).format(date);

  return `${fmt(start, false)} - ${fmt(end, true)}`;
};

export default function YearCompare({ compare }) {
  const { compareData, compareError, compareLoading } = useYearCompare({
    scope: compare?.scope,
    name: compare?.name,
    areaNumber: compare?.areaNumber,
    enabled: Boolean(compare),
  });

  if (!compare) {
    return (
      <div className="rounded-[1.4rem] border border-cyan-100/10 bg-white/5 px-5 py-6 text-sm leading-7 text-cyan-50/70">
        Year-over-year comparison is not available for this selection.
      </div>
    );
  }

  const windowDays = compareData?.windowDays ?? 14;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-7 text-cyan-50/70">
        Same last {windowDays} days vs prior years. Quickly see whether fish
        were being caught here at this time in past seasons.
      </p>

      {compareLoading && (
        <div className="rounded-[1.4rem] border border-cyan-100/10 bg-white/5 px-5 py-6 text-sm leading-7 text-cyan-50/70">
          Loading prior-year surveys...
        </div>
      )}

      {compareError && (
        <div className="rounded-[1.4rem] border border-rose-300/20 bg-rose-500/10 px-5 py-6 text-sm leading-7 text-rose-100/80">
          Could not load the comparison. Please try again.
        </div>
      )}

      {!compareLoading && !compareError && (
        <ul className="space-y-3.5">
          {(compareData?.years || []).map((yearRow) => {
            const meta = STATUS_META[yearRow.status] ?? STATUS_META.no_surveys;
            const windowLabel = formatWindow(
              yearRow.startDate,
              yearRow.endDate
            );
            const speciesEntries = Object.entries(yearRow.species || {}).filter(
              ([, total]) => total > 0
            );

            return (
              <li
                key={yearRow.year}
                className="rounded-[1.4rem] border border-cyan-100/10 bg-[linear-gradient(180deg,rgba(9,31,48,0.72),rgba(3,15,24,0.9))] px-5 py-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2.5">
                  <div className="min-w-0">
                    <p className="text-xl font-semibold tracking-[-0.03em] text-white tabular-nums">
                      {yearRow.year}
                    </p>
                    {windowLabel && (
                      <p className="mt-1.5 text-sm text-cyan-100/50">
                        {windowLabel}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-2 text-sm font-medium ${meta.textClass}`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${meta.dotClass}`}
                    />
                    {meta.label}
                  </span>
                </div>

                {yearRow.status !== "no_surveys" && (
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Fish", value: yearRow.totalFish },
                      { label: "Anglers", value: yearRow.anglers },
                      { label: "Reports", value: yearRow.reports },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1rem] border border-cyan-100/10 bg-[#03131f]/70 px-3 py-3"
                      >
                        <p className="creel-label text-cyan-100/50">
                          {item.label}
                        </p>
                        <p className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-white tabular-nums">
                          {Number(item.value || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {speciesEntries.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {speciesEntries.map(([species, total]) => (
                      <div
                        key={species}
                        className="rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-1.5 text-sm text-cyan-50/80"
                      >
                        <span className="font-medium text-white">{species}</span>{" "}
                        {total.toLocaleString()}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}

          {compareData && (compareData.years || []).length === 0 && (
            <li className="rounded-[1.4rem] border border-cyan-100/10 bg-white/5 px-5 py-6 text-sm leading-7 text-cyan-50/70">
              No prior-year data has been loaded yet for this location.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
