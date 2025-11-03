import PropTypes from "prop-types";
import "./Alert.css";

const Alert = ({ type = "info", message, icon, onClose, className = "" }) => {
  const defaultIcons = {
    error: "⚠️",
    success: "✅",
    warning: "⚠️",
    info: "ℹ️",
  };

  const displayIcon = icon !== undefined ? icon : defaultIcons[type];

  if (!message) return null;

  return (
    <div className={`alert alert-${type} ${className}`}>
      {displayIcon && <span className="alert-icon">{displayIcon}</span>}
      <span className="alert-message">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "success", "warning", "info"]),
  message: PropTypes.string,
  icon: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;
