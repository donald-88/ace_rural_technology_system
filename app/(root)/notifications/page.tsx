'use client';

import React, { useEffect, useState } from "react";
import NotificationCard from "@/components/notificationCard";

type Notification = {
  _id: string; 
  title: string;
  description: string;
  timestamp: string;
  receipt: string; 
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/motion-detection");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/motion-detection?id=${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === id
            ? { ...notification, receipt: "read" } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <section className="p-4">
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications
          .filter(notification => notification.receipt !== "read") 
          .map((notification) => (
            <NotificationCard
              key={notification._id}
              id={notification._id}
              title={notification.title}
              description={notification.description}
              timestamp={notification.timestamp}
              receipt={notification.receipt}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
      )}
    </section>
  );
};

export default Notifications;


