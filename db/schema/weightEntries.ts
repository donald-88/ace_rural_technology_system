import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";
import { handling } from "./handling";
import { dispatch } from "./dispatch";
import { createdAt, id, updatedAt } from "../schema-helper";

export const weightEntries = pgTable("weight_entries", {
    id: id,
    depositId: uuid("deposit_id").references(() => deposit.id),
    handlingId: uuid("handling_id").references(() => handling.id),
    dispatchId: uuid("dispatch_id").references(() => dispatch.id),
    bagsWeighed: integer("bags_weighed").notNull(),
    grossWeight: decimal("gross_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
})

export type WeightEntry = typeof weightEntries.$inferSelect
export type NewWeightEntry = typeof weightEntries.$inferInsert