import { useState } from "react";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import Alert from "../common/Alert";
import "./CreateScheduleModal.css";

const CreateScheduleModal = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    availableDate: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.availableDate || !formData.startTime || !formData.endTime) {
      setError("All fields are required");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
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
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
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
            <Button type="submit" variant="primary" loading={loading}>
              Create Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
