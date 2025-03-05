import { NextRequest, NextResponse } from "next/server";
import { startMotionMonitoring, lastMotionState } from "@/lib/utils";

// Start continuous motion monitoring when the API route is initialized.
startMotionMonitoring();

export async function GET(req: NextRequest) {
  console.log("Received GET request at /api/motion");
  // Return the latest motion state along with a status message.
  return NextResponse.json({ motionDetected: lastMotionState, message: "Motion monitoring is running." });
}
