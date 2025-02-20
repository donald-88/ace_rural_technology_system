import { db } from "@/db";
import { session, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm"; 

interface Entry {
  name: string;
  role: string;
}

export async function getRecentEntries(limit: number = 5): Promise<Entry[]> {
  const entries = await db
    .select({
      name: user.name,
      role: user.role,
      sessionCreatedAt: session.createdAt, 
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .orderBy(desc(session.createdAt))
    .limit(limit);


  return entries.map((entry) => ({
    name: entry.name,
    role: entry.role ?? "No Role",
  }));
}
