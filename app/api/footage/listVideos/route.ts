import mongoose from 'mongoose';
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Db } from 'mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cameraId = searchParams.get("cameraId");

  try {
    await dbConnect();
    const conn = mongoose.connection;
    const db = conn.db as Db;

    const query: { "metadata.cameraId"?: string } = {};
    if (cameraId) query["metadata.cameraId"] = cameraId;

    const collection = db.collection("videos.files");
    const videos = await collection.find(query)
      .sort({ "metadata.timestamp": -1 })
      .toArray();

    // Group videos
    const groupedVideos: Record<
      string,
      Record<string, Record<string, Record<string, any[]>>>
    > = {};

    videos.forEach((video) => {
      const date = new Date(video.metadata.timestamp);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString("default", { month: "long" });
      const day = `${date.getDate()} ${date.toLocaleDateString("default", {
        weekday: "long",
      })}`;
      const camera = video.metadata.cameraId;

      // Initialize nested objects if they don't exist
      if (!groupedVideos[year]) groupedVideos[year] = {};
      if (!groupedVideos[year][month]) groupedVideos[year][month] = {};
      if (!groupedVideos[year][month][day]) groupedVideos[year][month][day] = {};
      if (!groupedVideos[year][month][day][camera]) {
        groupedVideos[year][month][day][camera] = [];
      }

      groupedVideos[year][month][day][camera].push({
        ...video,
        formattedDate: new Date(video.metadata.timestamp).toLocaleString(),
      });
    });

    // Sort videos within each group by timestamp
    Object.values(groupedVideos).forEach((months) => {
      Object.values(months).forEach((days) => {
        Object.values(days).forEach((cameras) => {
          Object.values(cameras).forEach((videos) => {
            videos.sort((a, b) => 
              new Date(a.metadata.timestamp).getTime() - new Date(b.metadata.timestamp).getTime()
            );
          });
        });
      });
    });

    return new NextResponse(JSON.stringify({ 
      groupedVideos,
      totalVideos: videos.length 
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error("Error fetching videos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch videos" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}