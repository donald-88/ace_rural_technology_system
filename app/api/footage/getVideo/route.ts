import { MongoClient, GridFSBucket } from "mongodb";
import clientPromise from "@/lib/mongodbClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return new NextResponse("Filename is required.", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("ace_rural_technology_system");
  const bucket = new GridFSBucket(db, { bucketName: "videos" });

  try {
    const downloadStream = bucket.openDownloadStreamByName(filename);

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          downloadStream.on("data", (chunk) => controller.enqueue(chunk));
          downloadStream.on("end", () => controller.close());
          downloadStream.on("error", (err) => controller.error(err));
        },
      }),
      {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `inline; filename="${filename}"`,
        },
      }
    );
  } catch (err) {
    console.error("Error streaming video:", err);
    return new NextResponse("Failed to retrieve video.", { status: 500 });
  }
}

