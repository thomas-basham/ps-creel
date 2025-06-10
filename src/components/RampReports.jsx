import ReportCard from "./ReportCard";
export default function RampReports({
  selectedRamp,
  reports,
  setSelectedRamp,
}) {
  // Calculate total fish caught for the selected ramp (by species)
  const getTotalSpeciesCaught = (rampReports) => {
    const totalFish = {
      Chinook: 0,
      Coho: 0,
      Chum: 0,
      Pink: 0,
      Sockeye: 0,
      Lingcod: 0,
      Halibut: 0,
    };

    rampReports.forEach((report) => {
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

  return (
    <>
      {selectedRamp && (
        <div className="absolute max-h-full p-4 overflow-auto bg-white rounded-md shadow-lg bottom-4 left-4">
          <small className="text-gray-600">
            Showing {reports.length} most recent reports
          </small>
          <h2 className="text-xl font-bold text-gray-800">
            Reports for {selectedRamp[0].Ramp_site}
          </h2>

          {/* Total Fish Caught by Species */}
          <p className="font-semibold text-gray-700 text-md">
            Total Fish Caught:{" "}
            {getTotalFishCaught(getTotalSpeciesCaught(selectedRamp))}
          </p>
          <ul className="mb-4">
            {Object.entries(getTotalSpeciesCaught(selectedRamp)).map(
              ([species, total], idx) =>
                total > 0 && (
                  <li key={idx} className="text-gray-600">
                    {species}: {total}
                  </li>
                )
            )}
          </ul>

          <ul className="text-gray-600">
            {selectedRamp.map((report, idx) => (
              <ReportCard key={idx} report={report} />
            ))}
          </ul>

          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => setSelectedRamp(null)} // Close the popup
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
