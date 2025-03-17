"use server"

import { user } from "@/db/schema"
import { accessLogsSearchParamsData, requestAccessFormSchema } from "../validation"
import { db } from "@/db"
import { Access, access, NewAccess } from "@/db/schema/access"
import { DeviceInfo } from "@/types"
import { and, count, desc, eq, gte, inArray, lte, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { sendSMS } from "./sms.actions"
import { sendEmail } from "./email.actions"
import { filterColumn } from "../filter-column"
import { AccessLogResponse, AccessLogsResult } from "@/types/access"

/**
 * Generates a unique access ID based on the current date.
 * @returns {Promise<string>} The generated disp   atch ID.
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


export const getAccessLogs = async (input: accessLogsSearchParamsData): Promise<AccessLogsResult> => {
  try {
    const { page = 1, per_page = 10, sort, id, lockId, from, to, operator } = input

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
      // Apply id or lockId filter if provided
      id ? filterColumn({ column: access.id, value: id }) : undefined,
      lockId ? filterColumn({ column: access.lockId, value: lockId }) : undefined,

      // Apply date range filter if both dates are provided
      fromDay && toDay
        ? and(gte(access.createdAt, fromDay), lte(access.createdAt, toDay))
        : undefined,
    ].filter(Boolean) // Remove undefined values

    // Combine filters using "and" or "or" based on the operator
    const where = expressions.length > 0
      ? (!operator || operator === "and" ? and(...expressions) : or(...expressions))
      : undefined

    // Use left join instead of right join to ensure we get all access logs
    const result = await db
      .select({
        id: access.id,
        userId: user.id,
        name: user.name,
        lockId: access.lockId,
        code: access.code,
        reason: access.reason,
        role: user.role,
        createdAt: access.createdAt,
        endDate: access.endDate
      })
      .from(access)
      .leftJoin(user, eq(access.userId, user.id))
      .limit(per_page)
      .offset(offset)
      .where(where)
      .orderBy(desc(access.createdAt)) // Ensure consistent ordering

    const totalRows = await db
      .select({ count: count() })
      .from(access)
      .leftJoin(user, eq(access.userId, user.id))
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0)

    // Transform dates to ISO strings and ensure type safety
    const safeResult: AccessLogResponse[] = result.map(row => ({
      ...row,
      createdAt: typeof row.createdAt === 'object' && row.createdAt !== null ? (row.createdAt as Date).toISOString() : String(row.createdAt),
      endDate: typeof row.endDate === 'object' && row.endDate !== null ? (row.endDate as Date).toISOString() : String(row.endDate)
    }))

    return {
      data: safeResult,
      total: totalRows,
      pageCount: Math.ceil(totalRows / per_page)
    }
  } catch (error) {
    console.error("Error getting access logs:", error)
    // Return a safe error response instead of throwing
    return {
      data: [],
      total: 0,
      pageCount: 0,
      error: "Failed to fetch access logs"
    }
  }
}

type RequestAccessFormData = {
  deviceId: string;
  reason: string;
};

export const sendRequestAction = async (request: RequestAccessFormData, userId: string) => {
  try {
    const validatedData = requestAccessFormSchema.safeParse(request);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors.map((error) => error.message).join(", ")
      };
    }

    const lockId = validatedData.data.deviceId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count monthly code attempts
    const codeAttempts = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(access)
      .where(
        sql`${access.lockId} = ${lockId} 
              AND ${access.createdAt} >= ${today}`
      );

    const attemptCount = codeAttempts[0]?.count ?? 0;

    if (attemptCount >= 3) {
      await fetch(`${process.env.BASE_URL}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType: "lock",
          timestamp: new Date().toISOString(),
          deviceId: lockId,
          eventType: "monthly_code_attempts"
        })
      });
    }

    // Fetch the monthly code
    const response = await fetch(`${process.env.BASE_URL}/api/igloohome/getcode/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: lockId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error generating code:", errorData.error);
      return { success: false, error: errorData.error };
    }

    const generatedCode = await response.json();
    const generatedId = await generateACSId();

    console.log("Generated Code:", generatedCode);

    // Insert into database
    const result = await db.insert(access).values({
      id: generatedId,
      userId,
      lockId,
      code: Number(generatedCode.code.code),
      reason: validatedData.data.reason,
      startDate: generatedCode.code.startDate,
      endDate: generatedCode.code.endDate
    } as NewAccess).returning({ id: access.id });

    if (!result) {
      return { success: false, error: "Error sending request" };
    }

    // Send notification
    const smsSent = await sendSMS(
      "265999951829",
      `Your monthly code is: ${generatedCode.code}. It will expire at the end of the month.`
    );

    const emailSent = await sendEmail({
      to: "nambamcdonald@gmail.com",
      subject: "Your Monthly Code",
      text: `Your monthly code is: ${generatedCode.code}. It will expire at the end of the month.`
    });

    return { success: true, message: "Request sent successfully" };
  } catch (error) {
    console.error("Error sending request:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};


export const getRecentAccessLog = async (lockId?: string) => {
  try {
    // Build the base query
    const baseQuery = db
      .select({
        id: access.id,
        lockId: access.lockId,
        code: access.code,
        startDate: access.startDate,
        endDate: access.endDate,
        createdAt: access.createdAt
      })
      .from(access)
      .orderBy(desc(access.createdAt));

    // Execute the query with or without the lockId filter
    const accessLogs = await (lockId
      ? baseQuery.where(eq(access.lockId, lockId)).limit(1)
      : baseQuery.limit(2));

    // If no lockId was provided, find the active access log or the most recent one
    if (!lockId && accessLogs.length > 0) {
      // Check for an active access log (where current date is before endDate)
      const now = new Date();
      const activeLog = accessLogs.find(log => new Date(log.endDate) > now);

      // Return the active log if found, otherwise return the most recent log
      return activeLog || accessLogs[0];
    }

    return accessLogs[0] || {
      id: "",
      lockId: "",
      code: 0,
      startDate: "",
      endDate: "",
      createdAt: new Date()
    };
  } catch (error) {
    console.error("Error getting most recent access log:", error);
    throw error;
  }
}

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