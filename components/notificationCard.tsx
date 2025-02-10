import React from "react";
import { CircleX, TriangleAlert, Flame, Lock, Droplet } from "lucide-react";

const NotificationCard = ({
  title,
  description,
  timestamp,
  receipt,
  onMarkAsRead,
  id,
}: {
  title: string;
  description: string;
  timestamp: string;
  receipt: string;
  onMarkAsRead: (id: string) => void;
  id: string;
}) => {
  if (receipt === "read") return null;

  // Define styles for different notification types
  const typeStyles: Record<
    string,
    { bg: string; border: string; icon: React.ReactNode }
  > = {
    "Motion Detected": {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: <TriangleAlert size={20} color="#0052EA" />,
    },
    "Smoke Detected": {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: <Flame size={20} color="#D32F2F" />,
    },
    "High Humidity": {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      icon: <Droplet size={20} color="#F57C00" />,
    },
    "Excess OTP Attempts": {
      bg: "bg-gray-50",
      border: "border-gray-100",
      icon: <Lock size={20} color="#5D5F5D" />,
    },
  };

  // Ensure a default style if title doesn't match
  const { bg, border, icon } = typeStyles[title] ?? {
    bg: "bg-gray-50",
    border: "border-gray-100",
    icon: <TriangleAlert size={20} color="#5D5F5D" />,
  };

  return (
    <div
      className={`w-full h-20 flex items-center gap-4 border ${border} ${bg} rounded-lg p-4 mb-4`}
    >
      {icon}
      <div className="grow">
        <h4>{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <h4>{new Date(timestamp).toLocaleTimeString()}</h4>
      <CircleX
        size={20}
        color="#5D5F5D"
        onClick={() => onMarkAsRead(id)}
        className="cursor-pointer"
      />
    </div>
  );
};

export default NotificationCard;
