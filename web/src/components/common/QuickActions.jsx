// components/common/QuickActions.jsx
import PropTypes from "prop-types";
import "./QuickActions.css";

const QuickActions = ({ actions = [] }) => {
  return (
    <div className="quick-actions">
      <h3 className="quick-actions-title">Quick Actions</h3>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`action-card ${action.primary ? "action-primary" : ""}`}
            disabled={action.disabled}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      primary: PropTypes.bool,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

export default QuickActions;
