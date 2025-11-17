import PropTypes from "prop-types";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";
import "./ConsultationCard.css";

const ConsultationCard = ({
  consultation,
  showActions = true,
  onAddNotes,
  onApprove,
  onReject,
  onCancel,
  processing = false,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="consultation-card">
      <div className="card-header">
        <div className="student-info">
          <div className="avatar">
            {consultation.studentName?.charAt(0) || "?"}
          </div>
          <div>
            <h3>{consultation.studentName}</h3>
            {consultation.teamCode && (
              <span className="team-badge">{consultation.teamCode}</span>
            )}
          </div>
        </div>
        <StatusBadge status={consultation.status} type="consultation" />
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="label">📚 Topic:</span>
          <span className="value">{consultation.topic}</span>
        </div>
        <div className="info-row">
          <span className="label">📅 Date:</span>
          <span className="value">
            {formatDate(consultation.scheduledDate)}
          </span>
        </div>
        <div className="info-row">
          <span className="label">⏰ Time:</span>
          <span className="value">
            {consultation.startTime} - {consultation.scheduledEnd}
          </span>
        </div>

        {consultation.description && (
          <div className="description">
            <span className="label">Description:</span>
            <p>{consultation.description}</p>
          </div>
        )}

        {consultation.rejectionReason && (
          <div className="rejection-reason">
            <span className="label">❌ Rejection Reason:</span>
            <p>{consultation.rejectionReason}</p>
          </div>
        )}

        {consultation.adviserNotes && (
          <div className="adviser-notes">
            <span className="label">📝 Adviser Notes:</span>
            <p>{consultation.adviserNotes}</p>
          </div>
        )}
      </div>

      {showActions && (
        <div className="card-actions">
          {/* For Adviser - Add Notes */}
          {consultation.status === "APPROVED" &&
            onAddNotes &&
            !consultation.adviserNotes && (
              <Button
                variant="primary"
                onClick={() => onAddNotes(consultation)}
                disabled={processing}
              >
                📝 Add Notes & Complete
              </Button>
            )}

          {/* For Adviser - Approve/Reject */}
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

          {/* For Student - Cancel */}
          {consultation.status === "PENDING" && onCancel && (
            <Button
              variant="secondary"
              onClick={() => onCancel(consultation.id)}
              disabled={processing}
            >
              Cancel Request
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
