import { MongoClient, GridFSBucket, GridFSBucketWriteStream } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import clientPromise from "@/lib/mongodbClient";

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
        "-i", rtspUrl,
        "-c:v", "libx264",
        "-crf", "23",
        "-preset", "ultrafast",
        "-vf", "scale=640:360",
        "-b:v", "500k",
        "-f", "mp4",
        "-movflags", "frag_keyframe+empty_moov",
        "-",
    ]);

    const client = await clientPromise;
    const db = client.db("ace_rural_technology_system");

    const bucket = new GridFSBucket(db, { bucketName: "videos" });

    let uploadStream: GridFSBucketWriteStream | null = null;

    try {
        uploadStream = bucket.openUploadStream(`${cameraId}_${Date.now()}.mp4`, {
            contentType: "video/mp4",
            metadata: { cameraId, timestamp: new Date() },
        });

        ffmpeg.stdout.pipe(uploadStream);

        // Handle stream events
        ffmpeg.stdout.on("end", () => {
            console.log("Stream ended. Video saved to GridFS.");
            uploadStream?.end(); // Ensure stream finalization
        });

        ffmpeg.stderr.on("data", (err) => {
            console.error("FFmpeg error:", err.toString());
        });

        ffmpeg.on("error", (err) => {
            console.error("FFmpeg process error:", (err as Error).message);
            uploadStream?.destroy(err as Error);
        });

        uploadStream.on("finish", () => {
            console.log(`File successfully saved for camera: ${cameraId}`);
        });

        return new NextResponse("Recording started and saved to GridFS.", {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (err) {
        console.error("Error while saving video to MongoDB:", (err as Error).message);
        if (uploadStream) uploadStream.destroy(err as Error);
        return new NextResponse("Failed to start recording.", { status: 500 });
    } finally {
        ffmpeg.on("close", (code) => {
            console.log(`FFmpeg process closed with code: ${code}`);
        });
    }
}
