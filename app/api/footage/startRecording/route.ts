import { spawn } from "child_process";
import { GridFSBucket } from "mongodb";
import clientPromise from "@/lib/mongodbClient";
import { NextResponse } from "next/server";

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
        duration: 300
      }
    });

    const ffmpeg = spawn("ffmpeg", [
      "-y",  // Overwrite output files
      "-rtsp_transport", "tcp",
      "-rtsp_flags", "prefer_tcp",
      "-re",
      "-i", rtspUrl,
      "-c:v", "libx264",
      "-crf", "28",
      "-preset", "ultrafast",
      "-threads", "40",
      "-vf", "scale=640:360",
      "-b:v", "500k",
      "-t", "300", // Record for 5 minute
      "-f", "mp4",
      "-movflags", "frag_keyframe+empty_moov",
      "-bufsize", "1M",
      "-"
    ]);

    let dataReceived = false;

    // Set a timeout to kill hanging processes
    const timeoutId = setTimeout(() => {
      // console.log(`[${cameraId}] Recording timed out`);
      ffmpeg.kill();
      reject(new Error("Recording timed out"));
    }, 300000);  // 5 minutes

    ffmpeg.stdout.on("data", () => {
      dataReceived = true;
    });

    ffmpeg.stdout.pipe(uploadStream);

    ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();
      if (message.includes("frame=")) {  // Only log actual frame data
        // console.log(`[${cameraId}] Recording progress`);
      }
    });

    ffmpeg.on("close", (code) => {
      clearTimeout(timeoutId);
      const duration = (Date.now() - recordingStartTime) / 1000;

      if (code === 0 && dataReceived && duration >= 58) {  // Allow slight variation
        // console.log(`[${cameraId}] Recording completed successfully`);
        resolve();
      } else {
        // console.error(`[${cameraId}] Recording failed: code=${code}, duration=${duration}s`);
        reject(new Error(`Recording failed: code=${code}, duration=${duration}s`));
      }
      uploadStream.end();
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
  });
}

async function startRecording() {
  const client = await clientPromise;
  const db = client.db("ace_rural_technology_system");
  const bucket = new GridFSBucket(db, { bucketName: "videos" });

  while (systemInitialized) {
    for (const [cameraId, rtspUrl] of Object.entries(cameraUrls)) {
      try {
        await recordCamera(cameraId, rtspUrl, bucket);
        // console.log(`[${cameraId}] Recording cycle completed`);
      } catch (error) {
        // console.error(`[${cameraId}] Recording failed:`, error);
      }
      // Small delay between recordings
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function GET() {
  if (systemInitialized) {
    return new NextResponse("Recording system is already running.", {
      status: 409
    });
  }

  try {
    systemInitialized = true;
    startRecording();
    return new NextResponse("Recording system started.", { status: 200 });
  } catch (error) {
    systemInitialized = false;
    // console.error("Failed to start recording:", error);
    return new NextResponse("Failed to start recording system.", {
      status: 500
    });
  }
}

export async function DELETE() {
  systemInitialized = false;
  return new NextResponse("Recording system stopped.", { status: 200 });
}