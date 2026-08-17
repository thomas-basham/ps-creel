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
  // Catch_area already reads like "Area 3, La Push", so prefixing it again
  // rendered as "Area Area 3, La Push".
  const catchArea = String(report?.Catch_area ?? "").trim();
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
    <li className="rounded-[1.35rem] border border-cyan-100/10 bg-[linear-gradient(180deg,rgba(9,31,48,0.76),rgba(3,15,24,0.92))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div>
          <p className="creel-label text-cyan-100/50">Sample Date</p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
            {formattedSampleDate}
          </h3>
        </div>
        <div className="rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-1.5 text-sm text-cyan-50/75">
          {catchArea || "Area unknown"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
        <div className="rounded-[1.2rem] border border-cyan-100/10 bg-[#03131f]/70 px-4 py-4">
          <p className="creel-label text-cyan-100/50">Anglers</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white tabular-nums">
            {Number(report?.Anglers || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-cyan-100/10 bg-[#03131f]/58 px-4 py-4">
          <p className="creel-label text-cyan-100/50">Catch Breakdown</p>

          {catches.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {catches.map((entry) => (
                <div
                  key={entry.species}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-3.5 py-1.5 text-sm text-cyan-50/80"
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
        <p className="mt-5 text-sm leading-6 text-cyan-50/45">
          Launch {report.Ramp_site}
        </p>
      )}
    </li>
  );
}
