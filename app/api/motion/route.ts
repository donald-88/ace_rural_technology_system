import { NextResponse } from 'next/server';

// Temporary storage
let notifications: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, timestamp } = body;
    
    if (!title || !description || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newNotification = {
      _id: Date.now().toString(),
      title,
      description,
      timestamp,
      receipt: "unread",
    };
    
    notifications.push(newNotification);
    return NextResponse.json({ message: "Notification received" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
  }
  
  notifications = notifications.map((n) =>
    n._id === id ? { ...n, receipt: "read" } : n
  );
  
  return NextResponse.json({ message: "Notification updated" });
}