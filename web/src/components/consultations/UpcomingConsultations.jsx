import PropTypes from "prop-types";
import "./UpcomingConsultations.css";

const UpcomingConsultations = ({
  consultations = [],
  onBookNew,
  onViewAll,
}) => {
  return (
    <div className="consultations-section">
      <div className="section-header">
        <div className="section-header-text">
          <h2 className="section-title">Upcoming Consultations</h2>
          <p className="section-subtitle">Your scheduled thesis meetings</p>
        </div>
        {onBookNew && (
          <button className="btn-primary" onClick={onBookNew}>
            Book New
          </button>
        )}
      </div>

      <div className="consultations-card">
        {consultations.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No upcoming consultations</p>
            <p className="empty-subtext">
              Book your first consultation to get started
            </p>
          </div>
        ) : (
          <div className="consultations-list">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="consultation-item">
                <div className="consultation-avatar">
                  {consultation.adviserPicture || consultation.adviserPictureUrl ? (
                    <img 
                      src={consultation.adviserPicture || consultation.adviserPictureUrl} 
                      alt={consultation.adviser}
                      className="avatar-image"
                    />
                  ) : (
                    consultation.adviser?.charAt(0) || "A"
                  )}
                </div>
                <div className="consultation-details">
                  <h4 className="consultation-name">{consultation.adviser}</h4>
                  <p className="consultation-topic">{consultation.title}</p>
                  <div className="consultation-meta">
                    <span>
                      {consultation.day} {consultation.month}
                    </span>
                    <span>{consultation.time}</span>
                  </div>
                </div>
                <span className={`status-badge status-${consultation.status}`}>
                  {consultation.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {onViewAll && consultations.length > 0 && (
        <button className="btn-text-link" onClick={onViewAll}>
          View All Consultations
        </button>
      )}
    </div>
  );
};

UpcomingConsultations.propTypes = {
  consultations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      day: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      adviser: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  onBookNew: PropTypes.func,
  onViewAll: PropTypes.func,
};

export default UpcomingConsultations;
