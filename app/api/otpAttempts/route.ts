import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { access } from '@/db/schema/access';
import { eq, and, count, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Function to get the start of today’s date in UTC
const getStartOfDay = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export async function POST(req: NextRequest) {
  try {
    const { userId, lockId, otp, reason } = await req.json();
    if (!userId || !lockId || !otp || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Insert the access attempt
    const newAccess = {
      id: uuidv4(),
      userId,
      lockId,
      otp,
      reason,
      accessedTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(access).values(newAccess);

    // Step 2: Check how many times this lock has been accessed today
    const startOfDay = getStartOfDay();

    const [{ count: accessCount }] = await db
      .select({ count: count() })
      .from(access)
      .where(
        and(
          eq(access.lockId, lockId),
          sql`${access.accessedTime} >= ${startOfDay}` // Use raw SQL to compare timestamps
        )
      );

    // Step 3: If access count reaches 3, send a notification
    if (accessCount >= 3) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: 'lock',
          timestamp: new Date().toISOString(),
          deviceId: lockId,
          eventType: 'otp_attempts',
        }),
      });
    }

    return NextResponse.json({ message: 'Access logged successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in lock access API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
