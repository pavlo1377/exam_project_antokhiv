import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSchedule } from "../../features/schedule/scheduleSlice";
import { Link, useLocation, useParams } from "react-router";
import Loader from "../../ui/Loader";
import NotFound from "../NotFound/NotFoundPage";

function Schedule() {
  const { data, isLoading, error } = useSelector((state) => state.schedule);
  console.log("Redux state data:", data);

  const { year } = useParams();

  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (yearLink) => {
    if (`/schedule/${yearLink}` === location.pathname)
      return "text-lg font-semibold text-white hover:text-blue-100 underline";
    return "text-lg font-semibold text-white hover:text-blue-100";
  };

  // Викликаємо fetchSchedule при першому рендері компонента
  useEffect(() => {
    if (!isLoading && !data[year].length) {
      dispatch(fetchSchedule(year));
    }
  }, [dispatch, data, year]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "9:00 - 11:00",
    "11:00 - 13:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
  ];

  const scheduleMatrix = hours.map((hour) => {
    const row = daysOfWeek.map((day) => {
      const subject = data[year].find(
        (item) => item.day === day && item.hour === hour
      );
      return subject
        ? {
            subject: subject.subject,
            room: subject.room || "N/A",
            teacher: subject.teacher || "N/A",
          }
        : { subject: "No subject", room: "-", teacher: "-" };
    });
    return row;
  });

  if (isLoading) return <Loader />;
  if (error) return <NotFound />;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300">
      {/* Navbar */}
      <div className="w-full max-w-6xl bg-gradient-to-r from-blue-500 to-blue-300 shadow-lg rounded-lg p-4 mb-8 mt-6">
        <nav className="flex justify-between space-x-4">
          <Link to="/schedule/firstYear" className={isActive("firstYear")}>
            First Year
          </Link>
          <Link to="/schedule/secondYear" className={isActive("secondYear")}>
            Second Year
          </Link>
          <Link to="/schedule/thirdYear" className={isActive("thirdYear")}>
            Third Year
          </Link>
        </nav>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <table className="table-auto w-full border-collapse border border-gray-300 text-lg">
          <thead>
            <tr className="bg-blue-300">
              <th className="px-6 py-4 text-left text-gray-800 font-bold"></th>
              {daysOfWeek.map((day, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-center text-gray-800 font-bold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleMatrix.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                } hover:bg-gray-100`}
              >
                <td className="border px-6 py-4 font-semibold text-gray-900 text-xl">
                  {hours[rowIndex]}
                </td>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border px-6 py-4 text-gray-700 text-center"
                  >
                    <div className="font-bold">{cell.subject}</div>
                    <div className="text-sm text-gray-500">
                      Room: {cell.room}
                    </div>
                    <div className="text-sm text-gray-500">
                      Teacher: {cell.teacher}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;
