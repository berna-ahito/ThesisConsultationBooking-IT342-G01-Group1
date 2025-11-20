import React from "react";
import LogoImage from "../../assets/Icon_Prototype.png";
import "./Logo.css";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { logo: "logo-image-sm" },
    md: { logo: "logo-image-md" },
    lg: { logo: "logo-image-lg" },
  };

  const { logo } = sizes[size];

  return (
    <div className="logo-wrapper">
      <img src={LogoImage} alt="ThesisHub Logo" className={logo} />
      <span className="logo-text">ThesisHub</span>
    </div>
  );
}
