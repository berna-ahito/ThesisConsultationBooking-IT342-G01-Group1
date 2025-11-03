import PropTypes from "prop-types";
import "./RecentActivity.css";

const RecentActivity = ({
  activities = [],
  title = "Recent Activity",
  emptyMessage = "No recent activity",
}) => {
  return (
    <div className="recent-activity">
      <h3 className="section-title">{title}</h3>

      {activities.length === 0 ? (
        <div className="activity-empty">
          <span className="activity-empty-icon">📋</span>
          <p className="activity-empty-text">{emptyMessage}</p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon-wrapper">
                <span
                  className={`activity-icon activity-icon-${activity.type}`}
                >
                  {activity.icon}
                </span>
              </div>
              <div className="activity-content">
                <p className="activity-title">{activity.title}</p>
                {activity.description && (
                  <p className="activity-description">{activity.description}</p>
                )}
                <p className="activity-time">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["success", "info", "warning", "error"]),
    })
  ),
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
};

export default RecentActivity;
