import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

// Camera RTSP URLs
const cameraUrls = {
    "360": "rtsp://admin:ACE20242025@168.253.229.53:70",
    "entrance": "rtsp://admin:ACE20242025@168.253.229.53:71",
    "corridor-2": "rtsp://admin:ACE20242025@168.253.229.53:72",
    "corridor-1": "rtsp://admin:ACE20242025@168.253.229.53:73",
    "exit": "rtsp://ace:ACE20242025@168.253.229.53:74",
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const cameraId = searchParams.get("camera") || "360";

    const rtspUrl = cameraUrls[cameraId as keyof typeof cameraUrls] || cameraUrls["360"];

    const ffmpeg = spawn("ffmpeg", [
        "-rtsp_transport", "tcp",          // Use TCP transport for RTSP
        "-i", rtspUrl,                     // Input RTSP URL
        "-c:v", "libx264",                 // Use x264 codec for video
        "-preset", "superfast",            // Use an even faster preset
        "-tune", "zerolatency",            // Optimize for real-time streaming
        "-crf", "28",         
        "-f", "mp4",                       // Output format
        "-movflags", "frag_keyframe+empty_moov", // Enable fragmented MP4 for streaming
        "-vf", "scale=640:360",            // Rescale video to reduce load
        "-b:v", "100k",                    // Adjust bitrate for smoother streaming
        "-bufsize", "200k",                // Set buffer size
        "-threads", "40",                   // Use multiple threads for processing
        "-",
    ]);

    const readableStream = new ReadableStream({
        start(controller) {
            ffmpeg.stdout.on("data", (chunk) => {
                controller.enqueue(new Uint8Array(chunk));
            });

            ffmpeg.stdout.on("end", () => {
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
