"use server"

import { user } from "@/db/schema"
import { accessLogsSearchParamsData, requestAccessFormData, requestAccessFormSchema } from "../validation"
import { db } from "@/db"
import { Access, access, NewAccess } from "@/db/schema/access"
import { DeviceInfo } from "@/types"
import { and, count, desc, eq, gte, inArray, lte, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { sendSMS } from "./sms.actions"
import { sendEmail } from "./email.actions"
import { filterColumn } from "../filter-column"


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


export const getAccessLogs = async (input: accessLogsSearchParamsData) => {
    const { page, per_page, sort, id, lockId, from, to, operator } = input

    try {
        // Calculate offset for pagination
        const offset = (page - 1) * per_page

        // Split the sort string to determine column and order
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof Access | undefined, "asc" | "desc" | undefined]


        // Convert date strings to Date objects for date filtering
        const fromDay = from ? new Date(from) : undefined
        const toDay = to ? new Date(to) : undefined

        const expressions: (SQL<unknown> | undefined)[] = [
            // Apply depositorId filter if provided
            id
                ? filterColumn({
                    column: access.id,
                    value: id,
                })
                :
                lockId
                    ? filterColumn({
                        column: access.lockId,
                        value: lockId,
                    })
                    : undefined,

            // Apply date range filter if both dates are provided
            fromDay && toDay
                ? and(gte(access.createdAt, fromDay), lte(access.createdAt, toDay))
                : undefined,
        ]

        // Combine filters using "and" or "or" based on the operator
        const where = expressions.length > 0
            ? (!operator || operator === "and" ? and(...expressions) : or(...expressions))
            : undefined


        const result = await db.select({
            id: access.id,
            userId: user.id,
            name: user.name,
            lockId: access.lockId,
            otp: access.otp,
            reason: access.reason,
            role: user.role,
            createdAt: access.createdAt
        }).from(access).rightJoin(user, eq(access.userId, user.id))
            .limit(per_page)
            .offset(offset)
            .where(where)

        const totalRows = await db
            .select({ count: count() })
            .from(access).rightJoin(user, eq(access.userId, user.id))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        return {
            data: JSON.parse(JSON.stringify(result)),
            total: totalRows,
            pageCount: Math.ceil(totalRows / 10)
        }
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
            await fetch(`${process.env.BASE_URL}/api/notifications`, {
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
        const response = await fetch(`${process.env.BASE_URL}/api/igloohome/getotp/`, {
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
        const emailSent = await sendEmail({
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
        const response = await fetch(`${process.env.BASE_URL}/api/igloohome/getDeviceInfo/`, {
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