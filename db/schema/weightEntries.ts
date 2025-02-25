import { decimal, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";
import { handling } from "./handling";
import { dispatch } from "./dispatch";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

export const weightEntries = pgTable("weight_entries", {
    id: serial('id').primaryKey().notNull(),
    depositId: text("deposit_id").references(() => deposit.id, { onDelete: "cascade" }),
    handlingId: text("handling_id").references(() => handling.id, { onDelete: "cascade" }),
    dispatchId: text("dispatch_id").references(() => dispatch.id, { onDelete: "cascade" }),
    bagsWeighed: integer("bags_weighed").notNull(),
    grossWeight: decimal("gross_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
})

// weightEntries Relationships //
export const weightEntriesRelations = relations(weightEntries,
    ({ one }) => ({
        deposit: one(deposit, {
            fields: [weightEntries.depositId],
            references: [deposit.id]
        }),
        handling: one(handling, {
            fields: [weightEntries.handlingId],
            references: [handling.id]
        }),
        dispatch: one(dispatch, {
            fields: [weightEntries.dispatchId],
            references: [dispatch.id]
        })
    }))

export type WeightEntry = typeof weightEntries.$inferSelect
export type NewWeightEntry = typeof weightEntries.$inferInsert