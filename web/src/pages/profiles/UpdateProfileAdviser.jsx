import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import axios from "axios";

const UpdateProfilePage = () => {
  const { user, token, refreshUser } = useAuth(); // assuming your context provides token and refreshUser
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    pictureUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", 
        department: user.department || "",
        pictureUrl: user.pictureUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.put(
        "/api/v1/users/update", // your backend endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully!");
      refreshUser(); // refresh context user data
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "40px", maxWidth: "600px" }}>
      <h1>Update Profile</h1>
      {message && <p style={{ marginBottom: "10px" }}>{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group" style={{ marginBottom: "10px" }}>
          <label>Profile Picture URL</label>
          <input
            type="text"
            name="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <Button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
