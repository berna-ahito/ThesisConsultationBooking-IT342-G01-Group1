import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    studentId: user?.studentId || "",
    department: user?.department || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await updateProfile(formData);
      // res should contain token and updated user
      const updatedUser = {
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        pictureUrl: res.user.pictureUrl || null,
        role: res.user.role,
        isProfileComplete: res.user.isProfileComplete,
        studentId: res.user.studentId || null,
        department: res.user.department || null,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (res.token) localStorage.setItem('token', res.token);
      updateUser(updatedUser);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error('Update profile failed', err);
      setMessage(err.response?.data || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h2>Profile</h2>
      {message && <div style={{ marginBottom: 12 }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} />
        </label>

        <label>
          Student ID
          <input name="studentId" value={formData.studentId} onChange={handleChange} />
        </label>

        <label>
          Department
          <input name="department" value={formData.department} onChange={handleChange} />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
}
