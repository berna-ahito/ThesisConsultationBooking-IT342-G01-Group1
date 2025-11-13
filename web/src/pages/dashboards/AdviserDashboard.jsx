import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import { Calendar } from "../../components/common/calendar";

const AdviserDashboard = () => {
  const { user, logout } = useAuth();

  const students = [
    { name: "Juan Dela Cruz", date: "2025-11-12", section: "BSIT 3A" },
    { name: "Maria Santos", date: "2025-11-13", section: "BSIT 3B" },
    { name: "Pedro Reyes", date: "2025-11-14", section: "BSIT 3A" },
    { name: "Ana Villanueva", date: "2025-11-15", section: "BSIT 3C" },
    { name: "Luis Gomez", date: "2025-11-16", section: "BSIT 3B" },
  ];

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <div className="card">
        <h1>Faculty Adviser Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
         <Button
          onClick={logout}
          className="btn btn-danger"
          style={{ marginTop: "20px" }}
        >
          Update Profile
        </Button>
        <Button
          onClick={logout}
          className="btn btn-danger"
          style={{ marginTop: "20px" }}
        >
          Logout
        </Button>
      </div>

      <div className="card" style={{ marginTop: "20px", padding: "20px" }}>
        <h2>Quick Actions</h2>
        <p>Manage schedules, approve requests, view consultations.</p>

        {/* Flex layout: Student table + Calendar */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          
          {/* Student table */}
          <div style={{ flex: 2, maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f5f5f5" }}>
            
            {/* Table Header */}
            <div style={{ display: "flex", padding: "10px", fontWeight: "bold", borderBottom: "1px solid #ccc" }}>
              <div style={{ flex: 2 }}>Student Name</div>
              <div style={{ flex: 1 }}>Date</div>
              <div style={{ flex: 1 }}>Section</div>
              <div style={{ flex: 2 }}>Action</div>
            </div>

            {/* Table Rows */}
            {students.map((student, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 2 }}>{student.name}</div>
                <div style={{ flex: 1 }}>{student.date}</div>
                <div style={{ flex: 1 }}>{student.section}</div>
                <div style={{ flex: 2, display: "flex", gap: "5px" }}>
                  <Button style={{ flex: 1 }} className="btn btn-primary">View</Button>
                  <Button style={{ flex: 1 }} className="btn btn-success">Accept</Button>
                  <Button style={{ flex: 1 }} className="btn btn-danger">Cancel</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div style={{ flex: 1 }}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviserDashboard;
