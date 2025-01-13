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
        "-rtsp_transport", "tcp",
        "-re",  // Read input stream in real-time
        "-i", rtspUrl,
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "ultrafast",
        "-threads", "8",
        "-vf", "scale=640:360",
        "-b:v", "200k",
        "-f", "mp4",
        "-movflags", "frag_keyframe+empty_moov",
        "-bufsize", "1M",  // Buffer size adjustment
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
