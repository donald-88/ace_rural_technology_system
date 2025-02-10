import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// POST: Handle various notifications (motion, smoke, humidity, OTP attempts)
export async function POST(req: NextRequest) {
  try {
    const { deviceType, timestamp, deviceId, eventType } = await req.json();

    if (!deviceType || !deviceId || !eventType || !timestamp) {
      return NextResponse.json({ error: 'Invalid notification data.' }, { status: 400 });
    }

    // Ensure database connection
    await dbConnect();

    // Access the `notificationsDB` database
    const db = mongoose.connection.useDb('notificationsDB');
    const notificationsCollection = db.collection('notifications');

    let notification = {
      title: '',
      description: '',
      receipt: 'unread',
      timestamp: new Date(timestamp),
    };

    switch (eventType) {
      case 'motion':
        notification.title = 'Motion Detected';
        notification.description = `Motion detected at ${new Date(timestamp).toLocaleDateString()}.`;
        break;
      case 'smoke':
        notification.title = 'Smoke Detected';
        notification.description = `Smoke detected at ${new Date(timestamp).toLocaleDateString()}. Immediate action required!`;
        break;
      case 'humidity':
        notification.title = 'High Humidity Alert';
        notification.description = `Humidity levels exceeded normal range at ${new Date(timestamp).toLocaleDateString()}.`;
        break;
      case 'otp_attempts':
        notification.title = 'Excess OTP Attempts';
        notification.description = `Multiple failed OTP attempts detected at ${new Date(timestamp).toLocaleDateString()}. Potential security threat.`;
        break;
      default:
        return NextResponse.json({ error: 'Unknown notification type.' }, { status: 400 });
    }
    

    await notificationsCollection.insertOne(notification);

    return NextResponse.json(
      { message: 'Notification added successfully.', notification },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Retrieve all notifications from the database
export async function GET() {
  try {
    // Ensure database connection
    await dbConnect();

    // Access the `notificationsDB` database
    const db = mongoose.connection.useDb('notificationsDB');
    const notificationsCollection = db.collection('notifications');

    // Retrieve notifications sorted by timestamp (most recent first)
    const notifications = await notificationsCollection.find().sort({ timestamp: -1 }).toArray();

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Mark notification as read (update receipt)
export async function PATCH(req: NextRequest) {
  try {
    // Parse the query parameter 'id' from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required.' }, { status: 400 });
    }

    // Ensure database connection
    await dbConnect();

    // Access the `notificationsDB` database
    const db = mongoose.connection.useDb('notificationsDB');
    const notificationsCollection = db.collection('notifications');

    // Update the 'receipt' field to "read" by ID
    const result = await notificationsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { receipt: 'read' } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification marked as read.' }, { status: 200 });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
