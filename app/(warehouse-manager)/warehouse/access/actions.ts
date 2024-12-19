'use server'

import { sendRequest } from "@/lib/actions/warehouse_access.actions"

export async function sendRequestAction(intakeData: {
    _id?: string; // Optional, MongoDB will generate if not provided
  user_id: string;
  reason: string;
  datetime: Date; // Changed to Date type
  time_of_exit?: Date | null; // Optional field for time of exit
  otp: string;
  device_id: string;
  name: string;
  role: string;
}) {
    try {
        const response = await sendRequest(intakeData);

        if (!response.success) {
            return { success: false, error: response.message };
        }

        return { success: true, data: response.message };
    } catch (error) {
        console.error("Error sending intake request:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send intake request"
        };
    }
}
