import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/adminService";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Alert from "../../components/common/Alert";
import StatusBadge from "../../components/common/StatusBadge";
import "./AllUsersPage.css";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "ALL") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.studentId?.includes(searchTerm) ||
          user.teamCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const roleFilters = [
    { label: "All Users", value: "ALL", count: users.length },
    {
      label: "Students",
      value: "STUDENT_REP",
      count: users.filter((u) => u.role === "STUDENT_REP").length,
    },
    {
      label: "Faculty",
      value: "FACULTY_ADVISER",
      count: users.filter((u) => u.role === "FACULTY_ADVISER").length,
    },
    {
      label: "Admins",
      value: "ADMIN",
      count: users.filter((u) => u.role === "ADMIN").length,
    },
  ];

  if (loading) {
    return <div className="all-users-page">Loading...</div>;
  }

  return (
    <div className="all-users-page">
      <DashboardHeader
        title="All Users"
        subtitle="Manage system users and accounts"
        icon="👥"
      />

      <div className="users-container">
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        {/* Controls */}
        <div className="users-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, student ID, or team code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="clear-search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons">
            {roleFilters.map((filter) => (
              <button
                key={filter.value}
                className={`filter-btn ${
                  filterRole === filter.value ? "active" : ""
                }`}
                onClick={() => setFilterRole(filter.value)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          Showing <strong>{filteredUsers.length}</strong> of{" "}
          <strong>{users.length}</strong> users
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No Users Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRole("ALL");
              }}
              className="reset-btn"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Student ID</th>
                  <th>Team Code</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.pictureUrl ? (
                            <img src={user.pictureUrl} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <StatusBadge status={user.role} type="role" />
                    </td>
                    <td>
                      <StatusBadge status={user.accountStatus} type="account" />
                    </td>
                    <td className="center-cell">{user.studentId || "—"}</td>
                    <td className="center-cell">
                      {user.teamCode ? (
                        <span className="team-code">{user.teamCode}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="center-cell">{user.department || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
