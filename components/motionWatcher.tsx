'use client'

import { useEffect, useState } from "react";

const MotionWatcher = () => {
  const [motionDetected, setMotionDetected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/motion");
        const data = await response.json();
        setMotionDetected(data.motionDetected);
      } catch (error) {
        console.error("Error fetching motion data:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      
    </div>
  );
};

export default MotionWatcher;
