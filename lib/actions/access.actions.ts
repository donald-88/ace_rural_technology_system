"use server"

import { requestAccessFormData, requestAccessFormSchema } from "../validation"
import { db } from "@/db"
import { Access, access } from "@/db/schema/access"
import { DeviceInfo } from "@/types"

export const getAccessLogs = async (): Promise<Access[]> => {
    try {
        const result = await db.select().from(access)

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.error("Error getting access logs:", error)
        throw error
    }
}



export const sendRequestAction = async (request: requestAccessFormData, userId: string) => {
    try {
        const validatedData = requestAccessFormSchema.safeParse(request);
        if (!validatedData.success) {
            return {
                success: false,
                error: validatedData.error.errors.map(error => error.message).join(", ")
            };
        }

        console.log("Validated data:", validatedData.data);

        // Fetch OTP
        const response = await fetch("http://localhost:3000/api/igloohome/getotp/", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error generating OTP:", errorData.error);
            return {
                success: false,
                error: errorData.error
            };
        }

        const generatedOtp = await response.json();

        console.log("Generated OTP:", generatedOtp.pin);

        console.log("About to insert data");

        const result = await db.insert(access).values({
            id: validatedData.data.deviceId,
            userId: userId,
            lockId: validatedData.data.deviceId,
            otp: generatedOtp.pin,  // Make sure `pin` exists
            reason: validatedData.data.reason,
            accessedTime: new Date()
        });

        console.log("Inserted data");

        if (!result) {
            return {
                success: false,
                error: "Error sending request"
            };
        }

        return {
            success: true,
            message: "Request sent successfully"
        };
    } catch (error) {
        console.error("Error sending request:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};


export const getDeviceInfo = async (): Promise<DeviceInfo[]> => {
    try {
        const response = await fetch("http://localhost:3000/api/igloohome/getDeviceInfo/", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error generating OTP:", errorData.error);
            throw new Error(errorData.error);
        }

        return response.json();
    } catch (error) {
        throw error;

    }
}