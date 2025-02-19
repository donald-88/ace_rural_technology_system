import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: serial("id").primaryKey(),
    warehouse_id: text().notNull(),
    holder: text().notNull(),
    commodityVariety: text().notNull(),
    commodityGroup: text().notNull(),
    grade: text().notNull(),
    currency: text().notNull(),
    cropSeason: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
})

export type WarehouseReceipt = typeof warehouseReceipt.$inferSelect
export type NewWarehouseReceipt = typeof warehouseReceipt.$inferInsert