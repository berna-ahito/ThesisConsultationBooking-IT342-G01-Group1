import PropTypes from "prop-types";
import "./StatsGrid.css";

const StatsGrid = ({ stats = [] }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.primary ? "stat-primary" : ""}`}
        >
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
          {stat.description && (
            <span className="stat-desc">{stat.description}</span>
          )}
        </div>
      ))}
    </div>
  );
};

StatsGrid.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      description: PropTypes.string,
      primary: PropTypes.bool,
    })
  ),
};

export default StatsGrid;
