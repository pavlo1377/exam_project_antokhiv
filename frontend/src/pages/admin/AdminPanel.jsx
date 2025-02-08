import React, { useEffect, useState } from "react";
import Loader from "../../ui/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../../features/schedule/scheduleSlice";
import { useNavigate, useParams } from "react-router";
import reloadLogo from "../../assets/reload_logo.png";

const AdminPanel = () => {
  const { year } = useParams();
  const schedule = useSelector((state) => state.schedule.data[year]);
  const isLoading = useSelector((state) => state.schedule.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    day: "",
    hour: "",
    subject: "",
    teacher: "",
    room: "",
  });

  useEffect(() => {
    if (!schedule || schedule.length === 0) {
      dispatch(fetchSchedule(year));
    }
  }, [year]);

  const handleEdit = (id) => {
    const itemToEdit = schedule.find((item) => item.id === id);
    if (itemToEdit) {
      setSelectedItem(itemToEdit);
      setFormData({
        day: itemToEdit.day,
        hour: itemToEdit.hour,
        subject: itemToEdit.subject,
        teacher: itemToEdit.teacher,
        room: itemToEdit.room,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/schedule/${year}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setError(null);
        dispatch(fetchSchedule(year));
      } else {
        setError("Error deleting the item");
      }
    } catch {
      setError("Error deleting schedule");
    }
  };

  const handleAdd = async (newItem) => {
    try {
      const response = await fetch(`http://localhost:8081/schedule/${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        dispatch(fetchSchedule(year));
        setSelectedItem(null);
        setFormData({
          day: "",
          hour: "",
          subject: "",
          teacher: "",
          room: "",
        });
      } else {
        setError("Error adding the element");
      }
    } catch {
      setError("Failed to add schedule");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      if (selectedItem) {
        const response = await fetch(
          `http://localhost:8081/schedule/${year}/${selectedItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setError(null);
          dispatch(fetchSchedule(year));
          setSelectedItem(null);
          setFormData({
            day: "",
            hour: "",
            subject: "",
            teacher: "",
            room: "",
          });
        } else {
          setError("Failed to update schedule");
        }
      } else {
        await handleAdd(formData);
      }
    } catch {
      setError("Failed to submit form");
    }
  };

  return (
    <>
      {error && <p className="text-red-500">Error: {error}</p>}
      {isLoading && <Loader />}

      <div className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Admin Panel</h2>

        <div className="flex justify-center items-center space-x-4">
          <select
            name="year"
            value={year}
            onChange={(e) => navigate(`/admin/schedule/${e.target.value}`)}
            className="bg-neutral-200 rounded-md px-3 py-2"
          >
            <option value="firstYear">First Year</option>
            <option value="secondYear">Second Year</option>
            <option value="thirdYear">Third Year</option>
          </select>
          <button
            onClick={() => {
              setSelectedItem(null);
              setError(null);
              setFormData({
                day: "",
                hour: "",
                subject: "",
                teacher: "",
                room: "",
              });
            }}
          >
            <img src={reloadLogo} alt="Reload" className="h-10 w-10" />
          </button>
          <button
            onClick={() => navigate(`/schedule/${year}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            See the schedule
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="flex flex-wrap gap-4 mt-6">
          {["day", "hour", "subject", "teacher", "room"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          ))}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {selectedItem ? "Edit" : "Add"} subject
          </button>
        </form>

        <div className="overflow-x-auto mt-6">
          {schedule.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {/* Заголовок таблиці */}
              <div className="flex justify-between items-center p-3 bg-gray-300 font-semibold rounded-md">
                <div className="flex-1 text-center">Day</div>
                <div className="flex-1 text-center">Hour</div>
                <div className="flex-1 text-center">Subject</div>
                <div className="flex-1 text-center">Teacher</div>
                <div className="flex-1 text-center">Room</div>
                <div className="flex-1 text-center">Actions</div>
              </div>

              {/* Рядки з даними */}
              {schedule.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <h2 className="flex-1 text-center">{item.day}</h2>
                  <h2 className="flex-1 text-center">{item.hour}</h2>
                  <h2 className="flex-1 text-center">{item.subject}</h2>
                  <h2 className="flex-1 text-center">{item.teacher || "-"}</h2>
                  <h2 className="flex-1 text-center">{item.room}</h2>
                  <h2 className="flex flex-1 justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </h2>
                </div>
              ))}
            </div>
          ) : (
            <p>No schedule available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
