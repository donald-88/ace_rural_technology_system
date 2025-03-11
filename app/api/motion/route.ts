import { NextRequest, NextResponse } from "next/server";
import { startMotionMonitoring } from "@/lib/utils";

// Start backup polling when API initializes
startMotionMonitoring();

export async function GET(req: NextRequest) {
  console.log("Received GET request at /api/motion");
  return NextResponse.json({ message: "Motion monitoring is active (webhook + polling backup)." });
}
