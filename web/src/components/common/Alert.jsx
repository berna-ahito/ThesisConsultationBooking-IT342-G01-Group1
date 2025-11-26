import PropTypes from "prop-types";
import alertIcon from "../../assets/alert-svgrepo-com.svg";
import "./Alert.css";

const Alert = ({ type = "info", message, icon, onClose, className = "" }) => {
  const displayIcon = icon !== undefined ? icon : <img src={alertIcon} alt="alert" className="alert-svg" />;

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
  icon: PropTypes.node,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;
