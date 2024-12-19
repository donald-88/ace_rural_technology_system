"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "../mongodbClient";
import { ObjectId } from "mongodb"; // Import ObjectId

// Define the interface for intake parameters
interface IntakeParams {
  _id?: string; // Optional, MongoDB will generate if not provided
  user_id: string;
  reason: string;
  datetime: Date; // Changed to Date type
  time_of_exit?: Date | null; // Optional field for time of exit
  otp: string;
  device_id: string;
  name: string;
  role: string;
}

// Function to send the request to MongoDB
export const sendRequest = async (intake: IntakeParams): Promise<{ success: boolean; message: string }> => {
  try {
    const client = await clientPromise; // Connect to MongoDB client
    const db = client.db("ace_rural_technology_system"); // Database name
    const intakeCollection = db.collection("access_logs"); // Collection name

    // Insert the intake data into MongoDB
    const newRequest = await intakeCollection.insertOne({
      _id: intake._id ? new ObjectId(intake._id) : undefined, // Convert to ObjectId if provided
      user_id: intake.user_id,
      reason: intake.reason,
      datetime: intake.datetime, // Store as Date
      time_of_exit: intake.time_of_exit || null, // Default to null if not provided
      otp: intake.otp,
      device_id: intake.device_id,
      name: intake.name,
      role: intake.role,
    });

    console.log("New request added:", newRequest.insertedId);

    return { success: true, message: "Request successfully saved!" };
  } catch (error) {
    console.error("Error sending request:", error);
    return {
      success: false,
      message: "Error saving request. Please try again.",
    };
  }
};
