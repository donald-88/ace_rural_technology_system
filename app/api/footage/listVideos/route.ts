import clientPromise from "@/lib/mongodbClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const cameraId = searchParams.get("cameraId");
  const date = searchParams.get("date");

  const client = await clientPromise;
  const db = client.db("ace_rural_technology_system");

  const query:  { "metadata.cameraId"?: string; "metadata.timestamp"?: { $gte: Date; $lt: Date } } = {};
  if (cameraId) query["metadata.cameraId"] = cameraId;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query["metadata.timestamp"] = { $gte: start, $lt: end };
  }

  const collection = db.collection("videos.files");
  const videos = await collection
    .find(query)
    .sort({ "metadata.timestamp": -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments(query);
  return new NextResponse(
    JSON.stringify({ videos, total, page, limit }),
    { headers: { "Content-Type": "application/json" } }
  );
}
