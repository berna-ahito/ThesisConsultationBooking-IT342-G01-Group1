// src/components/common/QuickActions.jsx
import PropTypes from "prop-types";
import "./QuickActions.css";

const QuickActions = ({
  actions = [],
  title = "Quick Actions",
  subtitle = "Shortcut tools for your daily advising tasks",
}) => {
  return (
    <div className="quick-actions-card">
      <div className="quick-actions-header">
        <div>
          <h3 className="qa-title">{title}</h3>
          {subtitle && <p className="qa-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="actions-list">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`action-item ${action.primary ? "primary" : ""}`}
            disabled={action.disabled}
          >
            <div className="action-main">
              {action.icon && (
                <span className="action-icon">{action.icon}</span>
              )}
              <span className="action-label">{action.label}</span>
            </div>
            <span className="action-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
      icon: PropTypes.string,
      primary: PropTypes.bool,
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default QuickActions;
