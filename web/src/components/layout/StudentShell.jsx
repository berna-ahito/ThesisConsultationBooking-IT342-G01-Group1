import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./StudentShell.css";

export default function StudentShell() {
  return (
    <div className="student-shell">
      <Sidebar />
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
}
