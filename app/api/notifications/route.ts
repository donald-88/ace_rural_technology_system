import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db'; // Corrected import path
import { notifications, Type, NewNotification } from '@/db/schema/notifications';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // For generating IDs

// POST: Handle various notifications (motion, smoke, humidity, OTP attempts)
export async function POST(req: NextRequest) {
  try {
    const { deviceType, timestamp, deviceId, eventType } = await req.json();

    if (!deviceType || !deviceId || !eventType || !timestamp) {
      return NextResponse.json({ error: 'Invalid notification data.' }, { status: 400 });
    }

    let title: "motion" | "smoke" | "humidity" | "otp";
    let message = '';

    // Map eventType to schema types and create appropriate messages
    switch (eventType) {
      case 'motion':
        title = "motion";
        message = `Motion detected at ${new Date(timestamp).toLocaleDateString()}.`;
        break;
      case 'smoke':
        title = "smoke";
        message = `Smoke detected at ${new Date(timestamp).toLocaleDateString()}. Immediate action required!`;
        break;
      case 'humidity':
        title = "humidity";
        message = `Humidity levels exceeded normal range at ${new Date(timestamp).toLocaleDateString()}.`;
        break;
      case 'otp_attempts':
        title = "otp";
        message = `Multiple failed OTP attempts detected at ${new Date(timestamp).toLocaleDateString()}. Potential security threat.`;
        break;
      default:
        return NextResponse.json({ error: 'Unknown notification type.' }, { status: 400 });
    }

    // Insert notification into PostgreSQL using Drizzle
    const newNotification: NewNotification = {
      id: uuidv4(),
      title,
      message,
      read: false,
      createdAt: new Date(timestamp),
      updatedAt: new Date()
    };

    const result = await db.insert(notifications).values(newNotification).returning();

    return NextResponse.json(
      { message: 'Notification added successfully.', notification: result[0] },
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
    // Retrieve notifications sorted by createdAt (most recent first)
    const notificationList = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));

    return NextResponse.json(notificationList, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Mark notification as read
export async function PATCH(req: NextRequest) {
  try {
    // Parse the query parameter 'id' from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required.' }, { status: 400 });
    }

    // Update the 'read' field to true by ID
    const result = await db
      .update(notifications)
      .set({ read: true, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notification marked as read.' }, { status: 200 });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}