import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { warehouse } from "./warehouse";
import { depositor } from "./depositor";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: text().primaryKey(),
    warehouse_id: text().references(() => warehouse.id),
    depositor_id: text().references(() => depositor.id),
    commodityVariety: text().notNull(),
    commodityGroup: text().notNull(),
    commodityOutlier: text().notNull(),
    grade: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
})