import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: id,
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

export type WarehouseReceipt = typeof warehouseReceipt.$inferSelect
export type NewWarehouseReceipt = typeof warehouseReceipt.$inferInsert