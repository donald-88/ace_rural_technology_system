"use server"

import { user } from "@/db/schema"
import { requestAccessFormData, requestAccessFormSchema } from "../validation"
import { db } from "@/db"
import { Access, access, NewAccess } from "@/db/schema/access"
import { DeviceInfo } from "@/types"
import { desc, eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { sendSMS } from "./sms.actions"
import { sendEmail } from "./email.actions"


/**
 * Generates a unique access ID based on the current date.
 * @returns {Promise<string>} The generated dispatch ID.
 */
async function generateACSId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const prefix = `ACS-${datePart}-`;

    const latestRecord = await db
        .select({ id: access.id })
        .from(access)
        .where(
            sql`${access.id} LIKE ${prefix + '%'}` // Use LIKE operator for pattern matching
        )
        .orderBy(desc(access.id))
        .limit(1);

    let newCounter = 1;
    if (latestRecord.length > 0) {
        const lastId = latestRecord[0].id;
        const lastCounter = parseInt(lastId.split("-")[2], 10);
        newCounter = lastCounter + 1;
    }

    const newId = `ACS-${datePart}-${String(newCounter).padStart(4, "0")}`;
    return newId;
}


export const getAccessLogs = async (): Promise<Access[]> => {
    try {
        const result = await db.select({
            id: access.id,
            userId: user.id,
            name: user.name,
            deviceId: access.lockId,
            otp: access.otp,
            reason: access.reason,
            role: user.role,
            createdAt: access.createdAt
        }).from(access).rightJoin(user, eq(access.userId, user.id))

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

        const lockId = validatedData.data.deviceId;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        // Count OTP attempts for this lock today
        const otpAttempts = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(access)
            .where(
                sql`${access.lockId} = ${lockId} 
                AND ${access.accessedTime} >= ${today}`
            );

        const attemptCount = otpAttempts[0]?.count ?? 0;

        // Trigger notification if attempts exceed 3
        if (attemptCount >= 3) {
            await fetch("http://localhost:3000/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deviceType: "lock",
                    timestamp: new Date().toISOString(),
                    deviceId: lockId,
                    eventType: "otp_attempts"
                })
            });
        }

        // Fetch OTP
        const response = await fetch("http://localhost:3000/api/igloohome/getotp/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: lockId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error generating OTP:", errorData.error);
            return { success: false, error: errorData.error };
        }

        const generatedOtp = await response.json();
        const generatedId = await generateACSId();

        // Store the OTP attempt
        const result = await db.insert(access).values({
            id: generatedId,
            userId: userId,
            lockId: lockId,
            otp: generatedOtp.otp,
            reason: validatedData.data.reason,
            accessedTime: new Date()
        } as NewAccess).returning({ id: access.id });

        const smsSent = await sendSMS('265999951829', `Your OTP code is: ${generatedOtp.otp}. It will expire upon usage. Do not share this code with anyone.`);
        const emailSent  = await sendEmail({
            to: 'nambamcdonald@gmail.com',
            subject: "Your OTP Code",
            text: `Your OTP code is: ${generatedOtp.otp}. It will expire upon usage. Do not share this code with anyone.`
        });

        console.log(result);

        if (!result) {
            return { success: false, error: "Error sending request" };
        }

        return { success: true, message: "Request sent successfully" };
    } catch (error) {
        console.error("Error sending request:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
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

export const deleteAccessLogAction = async (accessLogIds: string[]) => {
    try {
        await db.delete(access).where(inArray(access.id, accessLogIds))
        revalidatePath("/inventory/access-logs")
        return {
            success: true,
            message: "Access log deleted successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error deleting access log"
        }
    }
}