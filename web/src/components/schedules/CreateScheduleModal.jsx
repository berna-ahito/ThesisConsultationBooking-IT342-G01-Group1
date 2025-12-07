import { useState } from "react";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import Alert from "../common/Alert";
import { formatTo12Hour } from "../../utils/formatters";
import "./CreateScheduleModal.css";

const CreateScheduleModal = ({ onClose, onSubmit, loading, backendError, existingSchedules = [] }) => {
  const [formData, setFormData] = useState({
    availableDate: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");
  const [conflictWarning, setConflictWarning] = useState("");

  const checkForTimeConflict = (date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return null;

    const selectedDate = new Date(date).toISOString().split('T')[0];

    const conflict = existingSchedules.find((schedule) => {
      const scheduleDate = new Date(schedule.availableDate).toISOString().split('T')[0];

      if (scheduleDate !== selectedDate) return false;

      const existingStart = schedule.startTime;
      const existingEnd = schedule.endTime;

      // Check if times overlap
      return startTime < existingEnd && endTime > existingStart;
    });

    return conflict || null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setError("");

    // Check for conflicts in real-time
    if (newFormData.availableDate && newFormData.startTime && newFormData.endTime) {
      const conflict = checkForTimeConflict(
        newFormData.availableDate,
        newFormData.startTime,
        newFormData.endTime
      );
      if (conflict) {
        setConflictWarning(
          `This time conflicts with an existing schedule on ${newFormData.availableDate} ` +
          `from ${formatTo12Hour(conflict.startTime)} to ${formatTo12Hour(conflict.endTime)}. You won't be able to add this schedule.`
        );
      } else {
        setConflictWarning("");
      }
    } else {
      setConflictWarning("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.availableDate || !formData.startTime || !formData.endTime) {
      setError("All fields are required");
      return;
    }

    const selectedDate = new Date(formData.availableDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Cannot create schedule for past dates");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    const [startHour, startMin] = formData.startTime.split(":").map(Number);
    const [endHour, endMin] = formData.endTime.split(":").map(Number);
    const duration = endHour * 60 + endMin - (startHour * 60 + startMin);

    if (duration < 30) {
      setError("Schedule must be at least 30 minutes long");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content schedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Create Availability Schedule</h3>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {(error || backendError) && (
            <Alert type="error" message={error || backendError} onClose={() => setError("")} />
          )}

          {conflictWarning && (
            <Alert type="error" message={conflictWarning} />
          )}

          <FormInput
            label="Date"
            type="date"
            name="availableDate"
            value={formData.availableDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            disabled={loading}
            required
          />

          <FormInput
            label="Start Time"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <FormInput
            label="End Time"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} disabled={loading || !!conflictWarning}>
              Create Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
