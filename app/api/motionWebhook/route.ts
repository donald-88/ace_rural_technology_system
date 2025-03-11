import { NextRequest, NextResponse } from "next/server";
import { stopMotionMonitoring } from "@/lib/utils";

const NOTIFICATION_API = process.env.NOTIFICATION_API || "http://localhost:3000/api/notifications";
let lastWebhookTime = Date.now(); // Tracks last received webhook event

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Incoming Webhook Data:", body);

    if (body.alarm && body.alarm.type !== "TEST") {
      lastWebhookTime = Date.now(); // ✅ Reset webhook timeout
      stopMotionMonitoring(); // ✅ Stop polling since webhook is working

      const motionData = {
        deviceType: body.alarm.deviceModel || "Unknown Camera",
        deviceId: body.alarm.device || "Unknown Device",
        eventType: body.alarm.type || "motion",
        timestamp: body.alarm.alarmTime || new Date().toISOString(),
      };

      console.log("🚨 Motion Alert Received:", motionData);

      const response = await fetch(NOTIFICATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(motionData),
      });

      if (!response.ok) {
        throw new Error(`Notification API responded with status: ${response.status}`);
      }

      console.log("✅ Motion notification sent successfully.");
    } else {
      console.log("ℹ️ Received a test webhook message, ignoring...");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error processing webhook request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
