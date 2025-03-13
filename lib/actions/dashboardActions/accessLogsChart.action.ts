import { db } from "@/db";
import { user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { access } from "@/db/schema/access"; 

interface AccessEntry {
  name: string;
  role: string;
  lockId: string;
  code: number; 
  reason: string;
  accessedTime: string; 
}


export async function getRecentEntries(limit: number = 5): Promise<AccessEntry[]> {
  const accessLogs = await db
    .select({
      name: user.name,
      role: user.role,
      lockId: access.lockId,
      code: access.code, 
      reason: access.reason,
      accessedTime: access.startDate, 
    })
    .from(access)
    .innerJoin(user, eq(access.userId, user.id))
    .orderBy(desc(access.startDate))
    .limit(limit);

  return accessLogs.map((entry) => ({
    name: entry.name,
    role: entry.role ?? "No Role",
    lockId: entry.lockId,
    code: entry.code,
    reason: entry.reason,
    accessedTime: entry.accessedTime, 
  }));
}


