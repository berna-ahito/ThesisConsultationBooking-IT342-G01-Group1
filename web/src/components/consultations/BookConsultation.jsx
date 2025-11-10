import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import './BookConsultation.css';
import { useAuth } from '../../context/AuthContext';

const BookConsultation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [advisers, setAdvisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    adviserId: '',
    scheduledStart: '',
    scheduledEnd: '',
    purpose: ''
  });

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await fetch('/api/users/advisers');
        const data = await response.json();
        setAdvisers(data);
      } catch (err) {
        setError('Failed to fetch advisers');
      }
    };

    fetchAdvisers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to book consultation');
      }

      navigate('/student/schedule');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="book-consultation">
      <h2>Book a Consultation</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="consultation-form">
        <div className="form-group">
          <label htmlFor="adviserId">Select Adviser</label>
          <select
            id="adviserId"
            name="adviserId"
            value={formData.adviserId}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Choose an adviser...</option>
            {advisers.map(adviser => (
              <option key={adviser.id} value={adviser.id}>
                {adviser.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="scheduledStart">Start Time</label>
          <FormInput
            type="datetime-local"
            id="scheduledStart"
            name="scheduledStart"
            value={formData.scheduledStart}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduledEnd">End Time</label>
          <FormInput
            type="datetime-local"
            id="scheduledEnd"
            name="scheduledEnd"
            value={formData.scheduledEnd}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Purpose of Consultation</label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="form-textarea"
            placeholder="Briefly describe the purpose of your consultation..."
          />
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Consultation'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookConsultation;