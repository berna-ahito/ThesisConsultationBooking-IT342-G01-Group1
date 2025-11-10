import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ConsultationCalendar.css';

const localizer = momentLocalizer(moment);

const ConsultationCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const start = moment().startOf('month').toISOString();
        const end = moment().endOf('month').toISOString();
        
        const response = await fetch(
          `/api/consultations/range?start=${start}&end=${end}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch consultations');
        }

        const consultations = await response.json();
        
        const calendarEvents = consultations.map(consultation => ({
          id: consultation.id,
          title: `Consultation with ${consultation.adviser.name}`,
          start: new Date(consultation.scheduledStart),
          end: new Date(consultation.scheduledEnd),
          status: consultation.status,
          purpose: consultation.purpose
        }));

        setEvents(calendarEvents);
      } catch (err) {
        setError('Failed to load consultations');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = 'var(--color-primary)';
    let borderColor = 'var(--color-primary-dark)';

    switch (event.status) {
      case 'APPROVED':
        backgroundColor = 'var(--color-success)';
        borderColor = 'var(--color-success-dark)';
        break;
      case 'PENDING':
        backgroundColor = 'var(--color-warning)';
        borderColor = 'var(--color-warning-dark)';
        break;
      case 'REJECTED':
        backgroundColor = 'var(--color-error)';
        borderColor = 'var(--color-error-dark)';
        break;
      case 'COMPLETED':
        backgroundColor = 'var(--color-gray-500)';
        borderColor = 'var(--color-gray-600)';
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-white)',
        border: 'none'
      }
    };
  };

  if (loading) {
    return <div className="calendar-loading">Loading schedule...</div>;
  }

  if (error) {
    return <div className="calendar-error">{error}</div>;
  }

  return (
    <div className="consultation-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="week"
        tooltipAccessor={event => `${event.title}\n${event.purpose}`}
      />
    </div>
  );
};

export default ConsultationCalendar;