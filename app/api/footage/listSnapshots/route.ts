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

    const collection = db.collection("snapshots.files");
    const snapshots = await collection.find(query)
      .sort({ "metadata.timestamp": -1 })
      .toArray();

    // Group snapshots
    const groupedSnapshots: Record<
      string,
      Record<string, Record<string, Record<string, any[]>>>
    > = {};

    snapshots.forEach((snapshot) => {
      const date = new Date(snapshot.metadata.timestamp);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString("default", { month: "long" });
      const day = `${date.getDate()} ${date.toLocaleDateString("default", {
        weekday: "long",
      })}`;
      const camera = snapshot.metadata.cameraId;

      // Initialize nested objects if they don't exist
      if (!groupedSnapshots[year]) groupedSnapshots[year] = {};
      if (!groupedSnapshots[year][month]) groupedSnapshots[year][month] = {};
      if (!groupedSnapshots[year][month][day]) groupedSnapshots[year][month][day] = {};
      if (!groupedSnapshots[year][month][day][camera]) {
        groupedSnapshots[year][month][day][camera] = [];
      }

      groupedSnapshots[year][month][day][camera].push({
        ...snapshot,
        formattedDate: new Date(snapshot.metadata.timestamp).toLocaleString(),
      });
    });

    // Sort snapshots within each group by timestamp
    Object.values(groupedSnapshots).forEach((months) => {
      Object.values(months).forEach((days) => {
        Object.values(days).forEach((cameras) => {
          Object.values(cameras).forEach((snapshots) => {
            snapshots.sort((a, b) => 
              new Date(a.metadata.timestamp).getTime() - new Date(b.metadatatimestamp).getTime()
            );
          });
        });
      });
    });

    return new NextResponse(JSON.stringify({ 
      groupedSnapshots,
      totalSnapshots: snapshots.length 
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error("Error fetching snapshots:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch snapshots" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}