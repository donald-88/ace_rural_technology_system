import React from "react";
import { CircleX, TriangleAlert, Flame, Lock, Droplet } from "lucide-react";
import { Notification } from "@/db/schema/notifications";

// Updated props to match the new schema
type NotificationCardProps = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
};

const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
  // Skip already read notifications
  if (notification.read) return null;

  // Get display title based on notification type
  const displayTitles: Record<string, string> = {
    'motion': 'Motion Detected',
    'smoke': 'Smoke Detected',
    'humidity': 'High Humidity Alert',
    'otp': 'Excess OTP Attempts'
  };

  // Define styles for different notification types
  const typeStyles: Record<
    string,
    { bg: string; border: string; icon: React.ReactNode }
  > = {
    "motion": {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: <TriangleAlert size={20} color="#0052EA" />,
    },
    "smoke": {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: <Flame size={20} color="#D32F2F" />,
    },
    "humidity": {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      icon: <Droplet size={20} color="#F57C00" />,
    },
    "otp": {
      bg: "bg-gray-50",
      border: "border-gray-100",
      icon: <Lock size={20} color="#5D5F5D" />,
    },
  };

  // Ensure a default style if title doesn't match
  const { bg, border, icon } = typeStyles[notification.title] ?? {
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
        <h4>{displayTitles[notification.title] || notification.title}</h4>
        <p className="text-gray-500 text-sm">{notification.message}</p>
      </div>
      <h4>{new Date(notification.createdAt).toLocaleTimeString()}</h4>
      <CircleX
        size={20}
        color="#5D5F5D"
        onClick={() => onMarkAsRead(notification.id)}
        className="cursor-pointer"
      />
    </div>
  );
};

export default NotificationCard;