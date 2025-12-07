import Button from "../common/Button";
import { formatTo12Hour } from "../../utils/formatters";
import "./SchedulesTable.css";

const SchedulesTable = ({ schedules, onDelete, onCreate }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (schedules.length === 0) {
    return (
      <div className="empty-schedules">
        <span className="empty-icon">📅</span>
        <h3>No schedules created yet</h3>
        <p>
          Create your first availability schedule to start accepting
          consultations
        </p>
        <Button onClick={onCreate} variant="primary">
          Create Your First Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="schedules-table-wrapper">
      <table className="schedules-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{formatDate(schedule.availableDate)}</td>
              <td>
                {formatTo12Hour(schedule.startTime)} - {formatTo12Hour(schedule.endTime)}
              </td>
              <td>
                <span
                  className={`status-badge ${
                    schedule.isBooked ? "booked" : "available"
                  }`}
                >
                  {schedule.isBooked ? "Booked" : "Available"}
                </span>
              </td>
              <td>
                {!schedule.isBooked && (
                  <Button
                    variant="secondary"
                    onClick={() => onDelete(schedule.id)}
                    size="small"
                  >
                    🗑️ Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesTable;
