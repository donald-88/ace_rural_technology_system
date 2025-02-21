import { decimal, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";
import { handling } from "./handling";
import { dispatch } from "./dispatch";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

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