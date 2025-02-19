import { sql } from "drizzle-orm";
import { decimal, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";
import { handling } from "./handling";
import { dispatch } from "./dispatch";

export const weightEntries = pgTable("weight_entries", {
    id: serial("id").primaryKey(),
    depositId: integer("deposit_id").references(() => deposit.id),
    handlingId: integer("handling_id").references(() => handling.id),
    dispatchId: integer("dispatch_id").references(() => dispatch.id),
    bagsWeighed: integer("bags_weighed").notNull(),
    grossWeight: decimal("gross_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type WeightEntry = typeof weightEntries.$inferSelect
export type NewWeightEntry = typeof weightEntries.$inferInsert