import React from "react";
import "./Logo.css";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { box: "logo-box-sm", text: "logo-text-sm" },
    md: { box: "logo-box-md", text: "logo-text-md" },
    lg: { box: "logo-box-lg", text: "logo-text-lg" },
  };

  const { box, text } = sizes[size];

  return (
    <div className="logo-wrapper">
      <div className={box}>
        <span className="logo-initial">T</span>
      </div>
      <span className={text}>ThesisHub</span>
    </div>
  );
}
