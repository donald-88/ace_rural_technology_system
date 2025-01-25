import clientPromise from "@/lib/mongodbClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cameraId = searchParams.get("cameraId");

  const client = await clientPromise;
  const db = client.db("ace_rural_technology_system");

  const query: { "metadata.cameraId"?: string } = {};
  if (cameraId) query["metadata.cameraId"] = cameraId;

  const collection = db.collection("videos.files");
  const videos = await collection.find(query).sort({ "metadata.timestamp": -1 }).toArray();

  // Group videos
  const groupedVideos: Record<
    string,
    Record<string, Record<string, Record<string, any[]>>>
  > = {};

  videos.forEach((video) => {
    const date = new Date(video.metadata.timestamp);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString("default", { month: "long" }); // e.g., January
    const day = `${date.getDate()} ${date.toLocaleDateString("default", {
      weekday: "long",
    })}`; // e.g., 24 Friday
    const camera = video.metadata.cameraId;

    if (!groupedVideos[year]) groupedVideos[year] = {};
    if (!groupedVideos[year][month]) groupedVideos[year][month] = {};
    if (!groupedVideos[year][month][day]) groupedVideos[year][month][day] = {};
    if (!groupedVideos[year][month][day][camera]) {
      groupedVideos[year][month][day][camera] = [];
    }

    groupedVideos[year][month][day][camera].push(video);
  });

  // Sort videos within each group by time
  Object.values(groupedVideos).forEach((months) => {
    Object.values(months).forEach((days) => {
      Object.values(days).forEach((cameras) => {
        Object.values(cameras).forEach((videos) => {
          videos.sort((a, b) => new Date(a.metadata.timestamp).getTime() - new Date(b.metadata.timestamp).getTime());
        });
      });
    });
  });

  return new NextResponse(JSON.stringify({ groupedVideos }), {
    headers: { "Content-Type": "application/json" },
  });
}
