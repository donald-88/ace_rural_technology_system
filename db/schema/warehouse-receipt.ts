import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { warehouse } from "./warehouse";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: text().primaryKey(),
    warehouse_id: text().references(() => warehouse.id),
    holder: text().notNull(),
    commodityVariety: text().notNull(),
    commodityGroup: text().notNull(),
    commodityOutlier: text().notNull(),
    grade: text().notNull(),
    currency: text().notNull(),
    cropSeason: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
})