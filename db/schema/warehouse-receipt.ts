import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { dispatch } from "./dispatch";
import { handling } from "./handling";
import { deposit } from "./deposit";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: text('id').primaryKey().notNull(),
    warehouse_id: text().notNull(),
    holder: text().notNull(),
    commodityVariety: text().notNull(),
    commodityGroup: text().notNull(),
    grade: text().notNull(),
    currency: text().notNull(),
    cropSeason: text().notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
})

// Warehouse Receipt Relations
export const warehouseReceiptRelations = relations(warehouseReceipt, ({ many }) => ({
    deposit: many(deposit),
    dispatch: many(dispatch),
    handling: many(handling)
}))

export type WarehouseReceipt = typeof warehouseReceipt.$inferSelect
export type NewWarehouseReceipt = typeof warehouseReceipt.$inferInsert