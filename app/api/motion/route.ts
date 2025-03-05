import { NextRequest, NextResponse } from "next/server";

const IPC_IP = "http://168.253.229.53:80"; // Remove embedded credentials
const CAMERA_USERNAME = "admin";
const CAMERA_PASSWORD = "ACE20242025";
const TOKEN = "44938d62e18fb5c"; // Keep this as is
const NOTIFICATION_API = process.env.NOTIFICATION_API || "http://localhost:3000/api/notifications";

// Function to check motion state
const checkMotionState = async () => {
    try {
        const url = `${IPC_IP}/api.cgi?cmd=GetMdState&channel=0&token=${TOKEN}`;
        console.log("Checking motion state at:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${CAMERA_USERNAME}:${CAMERA_PASSWORD}`).toString("base64"),
            },
        });

        if (!response.ok) {
            throw new Error(`Camera API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Motion state response:", data);

        return data[0]?.value?.state === 1; // 1 = Motion detected
    } catch (error) {
        console.error("Error fetching motion state:", error);
        return false;
    }
};

// Function to send motion event to notification API
const sendMotionAlert = async () => {
    try {
        const motionData = {
            deviceType: "camera",
            deviceId: "IPC001",
            eventType: "motion",
            timestamp: new Date().toISOString(),
        };

        console.log("Sending motion notification:", motionData);

        const response = await fetch(NOTIFICATION_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(motionData),
        });

        if (!response.ok) {
            throw new Error(`Notification API responded with status: ${response.status}`);
        }

        console.log("Motion notification sent successfully.");
    } catch (error) {
        console.error("Error sending motion notification:", error);
    }
};

// ✅ Correct Export for App Router
export async function GET(req: NextRequest) {
    console.log("Received GET request at /api/motion");

    const motionDetected = await checkMotionState();

    if (motionDetected) {
        await sendMotionAlert();
    }

    return NextResponse.json({ motionDetected });
}
