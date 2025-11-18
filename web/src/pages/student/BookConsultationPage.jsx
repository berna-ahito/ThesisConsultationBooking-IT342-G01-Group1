import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookConsultation } from "../../services/consultationService";
import { getAvailableSchedules } from "../../services/scheduleService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import FormInput from "../../components/common/FormInput";
import "./BookConsultationPage.css";

const BookConsultationPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduleId: "",
    topic: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAvailableSchedules();
  }, []);

  const fetchAvailableSchedules = async () => {
    try {
      setLoading(true);
      const data = await getAvailableSchedules();
      setSchedules(data);
    } catch (err) {
      console.error("❌ Failed to fetch schedules:", err);
      setError("Failed to load available schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scheduleId) {
      setError("Please select a consultation time");
      return;
    }

    if (!formData.topic.trim()) {
      setError("Please enter a consultation topic");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await bookConsultation({
        scheduleId: parseInt(formData.scheduleId),
        topic: formData.topic,
        description: formData.description,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 2000);
    } catch (err) {
      console.error("❌ Booking failed:", err);
      setError(err.response?.data?.message || "Failed to book consultation");
    } finally {
      setSubmitting(false);
    }
  };

  const formatScheduleOption = (schedule) => {
    const date = new Date(schedule.availableDate);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${dateStr} - ${schedule.startTime} to ${schedule.endTime} (${schedule.adviserName})`;
  };

  if (loading) {
    return (
      <DashboardLayout role="STUDENT_REP">
        <div style={{ padding: "2rem" }}>Loading available schedules...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT_REP">
      <DashboardHeader
        title="Book Consultation"
        subtitle="Schedule a meeting with your thesis adviser"
        icon="🗓️"
      />

      <div className="booking-container">
        <div className="booking-card">
          {success ? (
            <div className="success-state">
              <div className="success-icon"></div>
              <h2>Booking Successful!</h2>
              <p>Your consultation request has been submitted.</p>
              <p className="redirect-text">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              )}

              {schedules.length === 0 && (
                <Alert
                  type="warning"
                  message="No available time slots at the moment. Please check back later."
                />
              )}

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-section">
                  <h3>Select Time Slot</h3>

                  <FormInput
                    label="Available Time Slots"
                    type="select"
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleChange}
                    disabled={submitting || schedules.length === 0}
                    required
                  >
                    <option value="">-- Choose a time slot --</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {formatScheduleOption(schedule)}
                      </option>
                    ))}
                  </FormInput>
                </div>

                <div className="form-section">
                  <h3>Consultation Details</h3>

                  <FormInput
                    label="Consultation Topic"
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Chapter 3 Review, System Design Discussion"
                    disabled={submitting}
                    required
                    hint="Maximum 200 characters"
                  />

                  <FormInput
                    label="Description (Optional)"
                    type="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide additional details about what you'd like to discuss..."
                    disabled={submitting}
                    hint={`${formData.description.length}/500 characters`}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/student/dashboard")}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    disabled={schedules.length === 0}
                  >
                    Book Consultation
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookConsultationPage;
