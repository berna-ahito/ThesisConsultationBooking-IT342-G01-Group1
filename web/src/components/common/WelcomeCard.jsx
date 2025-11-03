import PropTypes from "prop-types";
import "./WelcomeCard.css";

const WelcomeCard = ({
  userName,
  greeting = "Welcome back",
  message = "You're all set to manage your thesis consultations.",
  stats = [],
}) => {
  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <h2 className="welcome-greeting">
          {greeting}, {userName?.split(" ")[0]}! 👋
        </h2>
        <p className="welcome-message">{message}</p>
      </div>

      {stats.length > 0 && (
        <div className="welcome-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

WelcomeCard.propTypes = {
  userName: PropTypes.string.isRequired,
  greeting: PropTypes.string,
  message: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
};

export default WelcomeCard;
