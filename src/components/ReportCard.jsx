export default function ReportCard({ report }) {
  return (
    <li className="mb-2">
      <p>{report.Sample_date}</p>
      <p>Anglers: {report.Anglers}</p>
      <p>Catch Area: {report.Catch_area}</p>
      {/* Show only fish caught if greater than 0 */}
      {report.Chinook > 0 && <p>Chinook: {report.Chinook}</p>}
      {report.Coho > 0 && <p>Coho: {report.Coho}</p>}
      {report.Chum > 0 && <p>Chum: {report.Chum}</p>}
      {report.Pink > 0 && <p>Pink: {report.Pink}</p>}
      {report.Sockeye > 0 && <p>Sockeye: {report.Sockeye}</p>}
      {report.Lingcod > 0 && <p>Lingcod: {report.Lingcod}</p>}
      {report.Halibut > 0 && <p>Halibut: {report.Halibut}</p>}

      <hr className="my-2" />
    </li>
  );
}
