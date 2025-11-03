import PropTypes from "prop-types";
import "./UpcomingConsultations.css";

const UpcomingConsultations = ({
  consultations = [],
  emptyMessage = "No upcoming consultations",
  emptySubtext = "Book your first consultation to get started!",
  onBookNow,
  showBookButton = true,
}) => {
  return (
    <div className="upcoming-consultations">
      <h3 className="section-title">Upcoming Consultations</h3>

      {consultations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <p className="empty-text">{emptyMessage}</p>
          <p className="empty-subtext">{emptySubtext}</p>
          {showBookButton && onBookNow && (
            <button onClick={onBookNow} className="btn-primary">
              Book Now
            </button>
          )}
        </div>
      ) : (
        <div className="consultations-list">
          {consultations.map((consultation, index) => (
            <div key={index} className="consultation-card">
              <div className="consultation-header">
                <div className="consultation-date">
                  <span className="date-day">{consultation.day}</span>
                  <span className="date-month">{consultation.month}</span>
                </div>
                <div className="consultation-info">
                  <h4 className="consultation-title">{consultation.title}</h4>
                  <p className="consultation-adviser">{consultation.adviser}</p>
                  <p className="consultation-time">
                    <span className="time-icon">🕐</span>
                    {consultation.time}
                  </p>
                </div>
              </div>
              <div className="consultation-actions">
                <span className={`status-badge status-${consultation.status}`}>
                  {consultation.status}
                </span>
                {consultation.onViewDetails && (
                  <button
                    onClick={consultation.onViewDetails}
                    className="btn-text"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

UpcomingConsultations.propTypes = {
  consultations: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      adviser: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["pending", "confirmed", "completed"]).isRequired,
      onViewDetails: PropTypes.func,
    })
  ),
  emptyMessage: PropTypes.string,
  emptySubtext: PropTypes.string,
  onBookNow: PropTypes.func,
  showBookButton: PropTypes.bool,
};

export default UpcomingConsultations;
