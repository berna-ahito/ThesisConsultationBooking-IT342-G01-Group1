import PropTypes from "prop-types";
import StatusBadge from "./StatusBadge";
import Button from "./Button";
import "./UserCard.css";

const UserCard = ({
  user,
  showActions = false,
  onApprove,
  onReject,
  processing = false,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {user.pictureUrl ? (
            <img src={user.pictureUrl} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <StatusBadge status={user.role} type="role" />
        </div>
      </div>

      <div className="user-card-body">
        {user.department && (
          <div className="info-row">
            <span className="label">🏢 Department:</span>
            <span className="value">{user.department}</span>
          </div>
        )}
        <div className="info-row">
          <span className="label">📅 Registered:</span>
          <span className="value">{formatDate(user.createdAt)}</span>
        </div>
        {user.emailVerified !== undefined && (
          <div className="info-row">
            <span className="label">✉️ Email Verified:</span>
            <span className="value">
              {user.emailVerified ? "Yes ✓" : "No ✗"}
            </span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="user-card-actions">
          <Button
            variant="primary"
            onClick={() => onApprove(user.id, user.name)}
            disabled={processing}
            loading={processing}
          >
            ✓ Approve
          </Button>
          <Button
            variant="secondary"
            onClick={() => onReject(user.id, user.name)}
            disabled={processing}
          >
            ✗ Reject
          </Button>
        </div>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  processing: PropTypes.bool,
};

export default UserCard;
