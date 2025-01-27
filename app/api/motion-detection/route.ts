import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// POST: Handle motion detection data and store notifications
export async function POST(req: NextRequest) {
  try {
    const { motionDetected, timestamp } = await req.json();

    if (!motionDetected || !timestamp) {
      return NextResponse.json({ error: 'Invalid motion detection data.' }, { status: 400 });
    }

    // Ensure database connection
    await dbConnect();

    // Access the `notificationsDB` database
    const db = mongoose.connection.useDb('notificationsDB');
    const notificationsCollection = db.collection('notifications');

    const newNotification = {
      title: 'Motion Detected',
      description: `Motion detected at ${timestamp}.`,
      receipt: 'unread',
      timestamp: new Date(timestamp),
    };

    await notificationsCollection.insertOne(newNotification);

    return NextResponse.json(
      { message: 'Motion detected and notification added successfully.', notification: newNotification },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling motion detection and notification:', error);
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
    console.error('Error in GET /api/motion-detection:', error);
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



