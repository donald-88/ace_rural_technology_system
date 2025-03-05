'use client'

import { useEffect } from "react";
import MotionWatcher from "@/components/motionWatcher";

export default function Dashboard() {
  // Trigger a one-time fetch to ensure /api/motion is hit when the dashboard loads.
  useEffect(() => {
    fetch("/api/motion")
      .then((response) => response.json())
      .then((data) => console.log("Motion monitoring triggered on load:", data))
      .catch((error) => console.error("Error triggering motion monitoring:", error));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <MotionWatcher />
    </div>
  );
}
