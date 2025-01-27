import React from "react";
import { CircleX, TriangleAlert } from 'lucide-react';

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
  
  if (receipt === "read") {
    return null; 
  }

  return (
    <div className="w-full h-20 flex items-center gap-4 border border-blue-100 bg-blue-50 rounded-lg p-4 mb-4">
      <TriangleAlert size={20} color='#0052EA' />
      <div className="grow">
        <h4>{title}</h4>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <h4>{new Date(timestamp).toLocaleTimeString()}</h4>
      <CircleX size={20} color='#5D5F5D' onClick={() => onMarkAsRead(id)} />
    </div>
  );
};

export default NotificationCard;