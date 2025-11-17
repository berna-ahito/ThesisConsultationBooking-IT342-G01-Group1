import PropTypes from "prop-types";
import "./QuickActions.css";

const QuickActions = ({ actions = [], title = "Quick Actions" }) => {
  return (
    <div className="quick-actions-card">
      <h3 className="card-title">{title}</h3>
      <div className="actions-list">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="action-item"
            disabled={action.disabled}
          >
            <span className="action-label">{action.label}</span>
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
    })
  ).isRequired,
  title: PropTypes.string,
};

export default QuickActions;
