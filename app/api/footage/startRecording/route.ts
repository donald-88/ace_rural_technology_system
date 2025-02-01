import { spawn } from "child_process";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

let isRecordingTriggered = false; // Global variable to track API trigger

const cameraUrls = {
  "360": "rtsp://admin:ACE20242025@168.253.229.53:70",
  "entrance": "rtsp://admin:ACE20242025@168.253.229.53:71",
  "corridor-2": "rtsp://admin:ACE20242025@168.253.229.53:72",
  "corridor-1": "rtsp://admin:ACE20242025@168.253.229.53:73",
  "exit": "rtsp://ace:ACE20242025@168.253.229.53:74",
};

let systemInitialized = false;

async function recordCamera(
  cameraId: string,
  rtspUrl: string,
  bucket: GridFSBucket
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${cameraId}_${timestamp}.mp4`;
    const recordingStartTime = Date.now();

    // console.log(`[${cameraId}] Starting recording`);

    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: "video/mp4",
      metadata: {
        cameraId,
        timestamp: new Date(),
        duration: 60,
      },
    });

    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-rtsp_transport",
      "tcp",
      "-rtsp_flags",
      "prefer_tcp",
      "-re",
      "-i",
      rtspUrl,
      "-c:v",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "ultrafast",
      "-threads",
      "40",
      "-vf",
      "scale=640:360",
      "-b:v",
      "200k",
      "-t",
      "60", // Record for 1 minute
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov",
      "-bufsize",
      "1M",
      "-",
    ]);

    let dataReceived = false;

    const timeoutId = setTimeout(() => {
      // console.log(`[${cameraId}] Recording timed out`);
      ffmpeg.kill();
      uploadStream.end();
      reject(new Error("Recording timed out"));
    }, 60000);

    ffmpeg.stdout.on("data", () => {
      dataReceived = true;
    });

    ffmpeg.stdout.pipe(uploadStream);

    ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();
      if (message.includes("frame=")) {
        // console.log(`[${cameraId}] Recording progress`);
      }
    });

    ffmpeg.on("close", (code) => {
      clearTimeout(timeoutId);
      const duration = (Date.now() - recordingStartTime) / 1000;

      if (code === 0 && dataReceived && duration >= 58) {
        // console.log(`[${cameraId}] Recording completed successfully`);
        uploadStream.end();
        resolve();
      } else {
        // console.error(`[${cameraId}] Recording failed: code=${code}, duration=${duration}s`);
        uploadStream.end();
        reject(new Error(`Recording failed: code=${code}, duration=${duration}s`));
      }
    });

    ffmpeg.on("error", (err) => {
      clearTimeout(timeoutId);
      // console.error(`[${cameraId}] FFmpeg error:`, err);
      uploadStream.end();
      reject(err);
    });

    uploadStream.on("error", (error) => {
      clearTimeout(timeoutId);
      // console.error(`[${cameraId}] Upload error:`, error);
      ffmpeg.kill();
      reject(error);
    });

    uploadStream.on("finish", () => {
      // console.log(`[${cameraId}] File upload completed`);
    });
  });
}

async function startRecording() {
  await dbConnect();
  const conn = mongoose.connection;
  const bucket = new mongoose.mongo.GridFSBucket(conn.db as any, {
    bucketName: "videos",
  });

  while (systemInitialized) {
    for (const [cameraId, rtspUrl] of Object.entries(cameraUrls)) {
      try {
        await recordCamera(cameraId, rtspUrl, bucket);
        // console.log(`[${cameraId}] Recording cycle completed`);
      } catch (error) {
        // console.error(`[${cameraId}] Recording failed:`, error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export async function POST() {
  if (isRecordingTriggered) {
    return NextResponse.json(
      { message: "Recording is already running." },
      { status: 200 }
    );
  }

  isRecordingTriggered = true;
  systemInitialized = true;

  try {
    startRecording();
    return NextResponse.json(
      { message: "Recording started successfully." },
      { status: 200 }
    );
  } catch (error) {
    isRecordingTriggered = false;
    // console.error("Failed to start recording:", error);
    return NextResponse.json(
      { message: "Failed to start recording." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  systemInitialized = false;
  isRecordingTriggered = false;
  return new NextResponse("Recording system stopped.", { status: 200 });
}
