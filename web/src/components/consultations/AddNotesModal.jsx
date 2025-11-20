import { useState } from "react";
import Button from "../common/Button";
import "./AddNotesModal.css";

const AddNotesModal = ({ consultation, onClose, onSubmit, loading }) => {
  const [notes, setNotes] = useState(consultation?.adviserNotes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert("Please enter consultation notes");
      return;
    }
    onSubmit(consultation.id, notes);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content notes-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add Consultation Notes</h3>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="consultation-summary">
            <div className="summary-item">
              <span className="label">Student:</span>
              <span className="value">{consultation?.studentName}</span>
            </div>
            <div className="summary-item">
              <span className="label">Team:</span>
              <span className="team-code">{consultation?.teamCode}</span>
            </div>
            <div className="summary-item">
              <span className="label">Topic:</span>
              <span className="value">{consultation?.topic}</span>
            </div>
            <div className="summary-item">
              <span className="label">Date:</span>
              <span className="value">
                {new Date(consultation?.scheduledDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="notes">
                Consultation Notes *
                <span className="hint">
                  Record discussion points, progress, and recommendations
                </span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes about the consultation...&#10;&#10;Example:&#10;- Discussed research methodology&#10;- Reviewed literature review section&#10;- Next steps: Complete data analysis by next week"
                rows={10}
                disabled={loading}
                required
              />
            </div>

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
                Save Notes & Mark Complete
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNotesModal;
