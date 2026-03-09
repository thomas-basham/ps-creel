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

  return (
    <div className="absolute  max-h-[90vh] p-4 bg-white rounded-md shadow-lg bottom-18 left-18 flex flex-col ">
      <div>
        <small className="text-gray-600">
          Showing {selectedReports.length} reports
        </small>
        <h2 className="text-xl font-bold text-gray-800">
          Reports for {selectedReportSet.title}
        </h2>
        {selectedReportSet.subtitle && (
          <p className="text-sm text-gray-600">{selectedReportSet.subtitle}</p>
        )}
      </div>
      <hr className="my-2" />
      <div className="overflow-auto max-h-9/12">
        <div className="overflow-scroll max-h-10/12 ">
          {selectedReports.length > 0 ? (
            <>
              {/* Total Fish Caught by Species */}
              <p className="font-semibold text-gray-700 text-md">
                Total Fish Caught: {totalFishCaught}
              </p>

              <ul className="mb-4">
                {Object.entries(totalSpeciesCaught).map(
                  ([species, total], idx) =>
                    total > 0 && (
                      <li key={idx} className="text-gray-600">
                        {species}: {total}
                      </li>
                    )
                )}
              </ul>
              <hr className="my-2" />

              <ul className="overflow-auto text-gray-600 ">
                {selectedReports.map((report, idx) => (
                  <ReportCard key={idx} report={report} />
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-600">No reports found for this selection.</p>
          )}
        </div>
      </div>
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:cursor-pointer hover:bg-blue-600"
        onClick={() => setSelectedReportSet(null)}
      >
        Close
      </button>
    </div>
  );
}
