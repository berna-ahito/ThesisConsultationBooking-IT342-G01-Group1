"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar({ className, ...props }) {
  return (
    <div className={className}>
      <DayPicker
        styles={{
          caption: { color: "#374151", fontWeight: "600" },
          day_selected: {
            backgroundColor: "#7c3aed",
            color: "white",
          },
          day_today: {
            color: "#7c3aed",
            fontWeight: "bold",
          },
        }}
        {...props}
      />
    </div>
  );
}
