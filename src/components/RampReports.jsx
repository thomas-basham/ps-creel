import ReportCard from "./ReportCard";

export default function RampReports({
  selectedReportSet,
  setSelectedReportSet,
}) {
  if (!selectedReportSet) return null;

  const selectedReports = selectedReportSet.reports || [];

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
    <div className="absolute inset-x-3 bottom-3 z-20 w-auto sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem] lg:w-[29rem]">
      <div className="creel-surface-strong flex max-h-[78vh] flex-col overflow-hidden rounded-[1.75rem]">
        <div className="border-b border-cyan-100/10 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.35em] text-cyan-100/50">
                Selection Lock
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                {selectedReportSet.title}
              </h2>
              {selectedReportSet.subtitle && (
                <p className="mt-2 text-sm leading-6 text-cyan-50/68">
                  {selectedReportSet.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-cyan-50/75 transition hover:border-cyan-100/30 hover:bg-white/10 hover:text-white"
              onClick={() => setSelectedReportSet(null)}
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="creel-metric-card rounded-[1.2rem] px-3 py-3"
              >
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.28em] text-cyan-100/45">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
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
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1.5 text-xs text-cyan-50/80"
                >
                  <span className="font-medium text-white">{species}</span>:{" "}
                  {total.toLocaleString()}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="creel-scrollbar flex-1 overflow-y-auto px-5 py-5">
          {selectedReports.length > 0 ? (
            <ul className="space-y-3">
              {selectedReports.map((report, idx) => (
                <ReportCard key={idx} report={report} />
              ))}
            </ul>
          ) : (
            <div className="rounded-[1.4rem] border border-cyan-100/10 bg-white/5 px-4 py-5 text-sm leading-7 text-cyan-50/68">
              No reports were found for this selection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
