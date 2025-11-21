import PropTypes from "prop-types";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";
import "./ConsultationCard.css";
import { getCurrentUser } from "../../services/authService";

const ConsultationCard = ({
  consultation,
  showActions = true,
  onAddNotes,
  onApprove,
  onReject,
  onCancel,
  processing = false,
}) => {
  const user = getCurrentUser();
  const role = user?.role;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  let displayName;
  let displayInitial;

  // STUDENT → show adviser
  if (
    role?.toLowerCase() === "student" ||
    role?.toLowerCase() === "student_rep"
  ) {
    displayName = consultation.adviserName;
    displayInitial = consultation.adviserName?.charAt(0).toUpperCase() || "?";
  }
  // ADVISER → show student
  else if (
    role?.toLowerCase() === "adviser" ||
    role?.toLowerCase() === "faculty" ||
    role?.toLowerCase() === "faculty_adviser"
  ) {
    displayName = consultation.studentName;
    displayInitial = consultation.studentName?.charAt(0).toUpperCase() || "?";
  }
  // FALLBACK
  else {
    displayName = consultation.studentName || consultation.adviserName;
    displayInitial = displayName?.charAt(0).toUpperCase() || "?";
  }

  return (
    <div className="compact-card">
      <div className="compact-top">
        <div className="compact-left">
          <div className="compact-avatar">{displayInitial}</div>

          <div className="compact-info">
            <h3 className="compact-name">{displayName}</h3>

            {consultation.teamCode && (
              <span className="compact-team">{consultation.teamCode}</span>
            )}

            <span className="compact-date">
              {formatDate(consultation.scheduledDate)} •{" "}
              {consultation.startTime}
            </span>
          </div>
        </div>

        <div className="compact-status">
          <StatusBadge status={consultation.status} type="consultation" />
        </div>
      </div>

      <div className="compact-details">
        <div className="compact-row">
          <span className="label">Topic:</span>
          <span className="value">{consultation.topic}</span>
        </div>

        {consultation.description && (
          <div className="compact-row">
            <span className="label">Desc:</span>
            <span className="value">{consultation.description}</span>
          </div>
        )}

        {consultation.adviserNotes && (
          <div className="compact-row">
            <span className="label">Notes:</span>
            <span className="value">{consultation.adviserNotes}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="compact-actions">
          {consultation.status === "PENDING" && onApprove && onReject && (
            <>
              <Button
                variant="primary"
                onClick={() => onApprove(consultation.id)}
                disabled={processing}
              >
                ✓ Approve
              </Button>
              <Button
                variant="secondary"
                onClick={() => onReject(consultation)}
                disabled={processing}
              >
                ✗ Reject
              </Button>
            </>
          )}

          {consultation.status === "APPROVED" &&
            onAddNotes &&
            !consultation.adviserNotes && (
              <Button
                variant="primary"
                onClick={() => onAddNotes(consultation)}
                disabled={processing}
              >
                📝 Add Notes
              </Button>
            )}

          {consultation.status === "PENDING" && onCancel && (
            <Button
              variant="secondary"
              onClick={() => onCancel(consultation.id)}
              disabled={processing}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

ConsultationCard.propTypes = {
  consultation: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  onAddNotes: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onCancel: PropTypes.func,
  processing: PropTypes.bool,
};

export default ConsultationCard;
