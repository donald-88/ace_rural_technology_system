import { db } from "@/db";
import { user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { access } from "@/db/schema/access"; 

interface AccessEntry {
  name: string;
  role: string;
  lockId: string;
  otp: number;
  reason: string;
  accessedTime: Date;
}

export async function getRecentEntries(limit: number = 5): Promise<AccessEntry[]> {
  const accessLogs = await db
    .select({
      name: user.name,
      role: user.role,
      lockId: access.lockId,
      otp: access.otp,
      reason: access.reason,
      accessedTime: access.accessedTime,
    })
    .from(access)
    .innerJoin(user, eq(access.userId, user.id))
    .orderBy(desc(access.accessedTime)) 
    .limit(limit);

  return accessLogs.map((entry) => ({
    name: entry.name,
    role: entry.role ?? "No Role", 
    lockId: entry.lockId,
    otp: entry.otp,
    reason: entry.reason,
    accessedTime: entry.accessedTime,
  }));
}
