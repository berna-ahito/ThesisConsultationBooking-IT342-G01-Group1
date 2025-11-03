import React from "react";

export default function AuthLayout({ title, subtitle, left = null, children }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-inner">
          <div className="login-left">
            {left ?? (
              <>
                <div className="login-logo"></div>
                <div className="login-header">
                  <h1 className="login-title">Thesis Consultation Booking</h1>
                  <p className="login-subtitle">
                    IT Department - Consultation System
                  </p>
                </div>
                <div className="login-welcome">
                  <h3>What You Can Do:</h3>
                  <ul>
                    <li>Schedule consultations with your thesis advisers</li>
                    <li>Track your thesis progress and milestones</li>
                    <li>Receive notifications for upcoming meetings</li>
                    <li>View your consultation history and feedback</li>
                    <li>Manage your academic documentation</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="login-right">
            <div className="mobile-header">
              <div className="login-logo"></div>
              <h1 className="login-title">{title}</h1>
              <p className="login-subtitle">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
