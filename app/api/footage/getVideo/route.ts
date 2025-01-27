import mongoose from 'mongoose';
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return new NextResponse("Filename is required.", { status: 400 });
  }

  try {
    await dbConnect();
    // Create a write stream to GridFS
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db as any, {
      bucketName: 'videos'
    });

    // Check if file exists first
    const files = await bucket.find({ filename: filename }).toArray();
    if (files.length === 0) {
      return new NextResponse("Video not found.", { status: 404 });
    }

    const downloadStream = bucket.openDownloadStreamByName(filename);

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          downloadStream.on("data", (chunk) => controller.enqueue(chunk));
          downloadStream.on("end", () => controller.close());
          downloadStream.on("error", (err) => {
            console.error("Stream error:", err);
            controller.error(err);
          });
        },
        cancel() {
          downloadStream.destroy();
        }
      }),
      {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `inline; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (err) {
    console.error("Error streaming video:", err);
    return new NextResponse(
      "Failed to retrieve video.",
      { status: err instanceof Error && err.message.includes("not found") ? 404 : 500 }
    );
  }
}