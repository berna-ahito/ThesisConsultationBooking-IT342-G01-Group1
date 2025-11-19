import PropTypes from "prop-types";
import "./StatusBadge.css";

const StatusBadge = ({ status, type = "consultation" }) => {
  const badges = {
    consultation: {
      PENDING: { class: "pending", icon: "⏳", text: "Pending" },
      APPROVED: { class: "approved", icon: "✓", text: "Approved" },
      REJECTED: { class: "rejected", icon: "✗", text: "Rejected" },
      COMPLETED: { class: "completed", icon: "✓", text: "Completed" },
      CANCELLED: { class: "cancelled", icon: "⊘", text: "Cancelled" },
    },
    account: {
      ACTIVE: { class: "active", icon: "✓", text: "Active" },
      PENDING: { class: "pending", icon: "⏳", text: "Pending" },
    },
    role: {
      STUDENT_REP: { class: "student", text: "Student" },
      FACULTY_ADVISER: { class: "faculty", text: "Faculty" },
      ADMIN: { class: "admin", text: "Admin" },
    },
  };

  const badge = badges[type]?.[status] || badges.consultation.PENDING;

  return (
    <span className={`status-badge ${badge.class}`}>
      {badge.icon && `${badge.icon} `}
      {badge.text}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["consultation", "account", "role"]),
};

export default StatusBadge;
