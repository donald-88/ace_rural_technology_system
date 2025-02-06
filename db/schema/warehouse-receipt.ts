import { pgTable, text } from "drizzle-orm/pg-core";
import { warehouse } from "./warehouse";

export const warehouseReceipt = pgTable('warehouse_receipt', {
    id: text().primaryKey(),
    warehouse_id: text().references(() => warehouse.id),
})