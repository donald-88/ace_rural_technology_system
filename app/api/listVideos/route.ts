import { MongoClient, GridFSBucket } from "mongodb";
import clientPromise from "@/lib/mongodbClient";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ace_rural_technology_system");
  const bucket = new GridFSBucket(db, { bucketName: "videos" });

  try {
    const files = await bucket.find().toArray();
    const filenames = files.map((file) => file.filename);

    return new NextResponse(JSON.stringify(filenames), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching video list:", err);
    return new NextResponse("Failed to fetch video list.", { status: 500 });
  }
}
