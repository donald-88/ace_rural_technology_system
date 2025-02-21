import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { weightEntries } from "./weightEntries";

export const dispatch = pgTable('dispatch', {
    id: id,
    warehouseReceiptId: uuid().references(() => warehouseReceipt.id),
    drawDownId: text().notNull(),
    noOfBags: integer().notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
});

// Dispatch Relations
export const dispatchRelations = relations(dispatch, ({ one }) => ({
    warehouseReceipt: one(warehouseReceipt, {
        fields: [dispatch.warehouseReceiptId],
        references: [warehouseReceipt.id]
    }),
    weightEntries: one(weightEntries)
}))

export type Dispatch = typeof dispatch.$inferSelect
export type NewDispatch = typeof dispatch.$inferInsert