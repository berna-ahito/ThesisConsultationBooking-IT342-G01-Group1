import PropTypes from "prop-types";
import "./NoticeBox.css";

const NoticeBox = ({
  type = "info",
  icon,
  title,
  message,
  children,
  className = "",
}) => {
  return (
    <div className={`notice-box notice-${type} ${className}`}>
      {icon && <span className="notice-icon">{icon}</span>}
      <div className="notice-content">
        {title && <strong className="notice-title">{title}</strong>}
        {message && <p className="notice-message">{message}</p>}
        {children}
      </div>
    </div>
  );
};

NoticeBox.propTypes = {
  type: PropTypes.oneOf(["info", "warning", "success", "error"]),
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default NoticeBox;
