import PropTypes from "prop-types";
import { useEffect } from "react";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";
import "./ConsultationCard.css";
import { getCurrentUser } from "../../services/authService";
import notesIcon from "../../assets/add-document-note-svgrepo-com.svg";

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

  // Debug: Log what fields are available
  useEffect(() => {
    console.log("📋 ConsultationCard Data:", {
      adviserName: consultation.adviserName,
      adviserPictureUrl: consultation.adviserPictureUrl,
      adviserPicture: consultation.adviserPicture,
      studentName: consultation.studentName,
      studentPictureUrl: consultation.studentPictureUrl,
      studentPicture: consultation.studentPicture,
      allFields: Object.keys(consultation)
    });
  }, [consultation]);

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
  let pictureUrl = null;

  // STUDENT → show adviser
  if (
    role?.toLowerCase() === "student" ||
    role?.toLowerCase() === "student_rep"
  ) {
    displayName = consultation.adviserName;
    displayInitial = consultation.adviserName?.charAt(0).toUpperCase() || "?";
    // Try multiple picture URL field names
    pictureUrl = consultation.adviserPictureUrl || consultation.adviserPicture || consultation.adviserProfilePicture;
  }
  // ADVISER → show student
  else if (
    role?.toLowerCase() === "adviser" ||
    role?.toLowerCase() === "faculty" ||
    role?.toLowerCase() === "faculty_adviser"
  ) {
    displayName = consultation.studentName;
    displayInitial = consultation.studentName?.charAt(0).toUpperCase() || "?";
    // Try multiple picture URL field names
    pictureUrl = consultation.studentPictureUrl || consultation.studentPicture || consultation.studentProfilePicture;
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
          <div className="compact-avatar">
            {pictureUrl ? (
              <img 
                src={pictureUrl} 
                alt={displayName}
                className="avatar-image"
              />
            ) : (
              displayInitial
            )}
          </div>

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
                <img src={notesIcon} alt="Add Notes" className="button-icon" />
                Add Notes
              </Button>
            )}

          {consultation.status === "PENDING" &&
            onCancel &&
            role?.toLowerCase().includes("student") && (
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
