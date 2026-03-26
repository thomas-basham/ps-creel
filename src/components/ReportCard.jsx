export default function ReportCard({ report }) {
  const speciesFields = [
    "Chinook",
    "Coho",
    "Chum",
    "Pink",
    "Sockeye",
    "Lingcod",
    "Halibut",
  ];
  const catches = speciesFields
    .map((species) => ({
      species,
      total: Number(report?.[species] || 0),
    }))
    .filter((entry) => entry.total > 0);
  const sampleDate = new Date(
    report?.sample_date_parsed ?? report?.Sample_date ?? ""
  );
  const formattedSampleDate = Number.isNaN(sampleDate.getTime())
    ? report?.Sample_date || "Unknown sample date"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(sampleDate);

  return (
    <li className="rounded-[1.35rem] border border-cyan-100/10 bg-[linear-gradient(180deg,rgba(9,31,48,0.76),rgba(3,15,24,0.92))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-cyan-100/45">
            Sample Date
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
            {formattedSampleDate}
          </h3>
        </div>
        <div className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.25em] text-cyan-50/70">
          Area {report?.Catch_area || "--"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
        <div className="rounded-[1.2rem] border border-cyan-100/10 bg-[#03131f]/70 px-4 py-3">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-cyan-100/45">
            Anglers
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            {Number(report?.Anglers || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-cyan-100/10 bg-[#03131f]/58 px-4 py-3">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-cyan-100/45">
            Catch Breakdown
          </p>

          {catches.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {catches.map((entry) => (
                <div
                  key={entry.species}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1.5 text-xs text-cyan-50/80"
                >
                  <span className="font-medium text-white">
                    {entry.species}
                  </span>{" "}
                  {entry.total.toLocaleString()}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-cyan-50/55">
              No retained catch recorded for this survey.
            </p>
          )}
        </div>
      </div>

      {report?.Ramp_site && (
        <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-cyan-100/38">
          Launch {report.Ramp_site}
        </p>
      )}
    </li>
  );
}
