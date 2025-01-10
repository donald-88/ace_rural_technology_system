import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

const cameraUrls = {
    "360": "rtsp://admin:ACE20242025@168.253.229.53:70", // First channel for 360 camera
    "entrance": "rtsp://admin:ACE20242025@168.253.229.53:71",
    "corridor-2": "rtsp://admin:ACE20242025@168.253.229.53:72",
    "corridor-1": "rtsp://admin:ACE20242025@168.253.229.53:73",
    "exit": "rtsp://ace:ACE20242025@168.253.229.53:74",
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const cameraId = searchParams.get("camera") || "360"; // Default to "360" if no camera param is provided

    const rtspUrl = cameraUrls[cameraId as keyof typeof cameraUrls] || cameraUrls["360"];

    // Adjusting ffmpeg to reduce the quality
    const ffmpeg = spawn("ffmpeg", [
        "-rtsp_transport", "tcp", // Force TCP for RTSP
        "-i", rtspUrl,
        "-c:v", "libx264", // Use a different codec (libx264 for better compression)
        "-crf", "28", // Constant Rate Factor (higher value reduces quality)
        "-preset", "fast", // Faster encoding at the cost of quality
        "-vf", "scale=640:360", // Scale down resolution for lower quality (adjust as needed)
        "-b:v", "300k", // Set a lower bitrate to reduce video quality
        "-f", "mp4",
        "-movflags", "frag_keyframe+empty_moov",
        "-",
    ]);

    const readableStream = new ReadableStream({
        start(controller) {
            console.log("Starting stream...");
            ffmpeg.stdout.on("data", (chunk) => {
                console.log("Received chunk...");
                controller.enqueue(new Uint8Array(chunk));
            });

            ffmpeg.stdout.on("end", () => {
                console.log("Stream ended.");
                controller.close();
            });

            ffmpeg.stderr.on("data", (err) => {
                console.error("FFmpeg error:", err.toString());
            });

            ffmpeg.on("error", (err) => {
                console.error("Process error:", err.toString());
                controller.error(err);
            });
        },
    });

    return new NextResponse(readableStream, {
        headers: {
            "Content-Type": "video/mp4",
            "Transfer-Encoding": "chunked",
        },
    });
}
