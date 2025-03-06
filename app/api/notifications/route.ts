import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, NewNotification } from "@/db/schema/notifications";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendSMS } from "@/lib/actions/sms.actions";
import { sendEmail } from "@/lib/actions/email.actions";

export async function POST(req: NextRequest) {
  try {
    const { deviceType, timestamp, deviceId, eventType } = await req.json();

    if (!deviceType || !deviceId || !eventType || !timestamp) {
      return NextResponse.json(
        { error: "Invalid notification data." },
        { status: 400 }
      );
    }

    let title: "motion" | "smoke" | "humidity" | "otp";
    let message = "";

    switch (eventType) {
      case "motion":
        title = "motion";
        message = `Motion detected at ${new Date(
          timestamp
        ).toLocaleDateString()}.`;
        break;
      case "smoke":
        title = "smoke";
        message = `Smoke detected at ${new Date(
          timestamp
        ).toLocaleDateString()}. Immediate action required!`;
        break;
      case "humidity":
        title = "humidity";
        message = `Humidity levels exceeded normal range at ${new Date(
          timestamp
        ).toLocaleDateString()}.`;
        break;
      case "otp_attempts":
        title = "otp";
        message = `Multiple failed OTP attempts detected at ${new Date(
          timestamp
        ).toLocaleDateString()}. Potential security threat.`;
        break;
      default:
        return NextResponse.json(
          { error: "Unknown notification type." },
          { status: 400 }
        );
    }

    const newNotification: NewNotification = {
      id: uuidv4(),
      title,
      message,
      read: false,
      createdAt: new Date(timestamp),
      updatedAt: new Date(),
    };

    const result = await db.insert(notifications).values(newNotification).returning();

    // Fire SMS asynchronously without blocking the response
    const smsRecipient = "+265999951829"; // Replace with actual number
    sendSMS(smsRecipient, message).catch((err) =>
      console.error("SMS failed:", err)
    );

    // Fire Email asynchronously without blocking the response
    const emailRecipient = "nambamcdonald@gmail.com"; // Replace with actual recipient
    sendEmail({
      to: emailRecipient,
      subject: `Alert: ${title} Detected`,
      text: message,
    }).catch((err) => console.error("Email failed:", err));

    return NextResponse.json(
      { message: "Notification added successfully.", notification: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
