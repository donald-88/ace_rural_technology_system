import { decimal, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { createdAt, id, updatedAt } from "../schema-helper";

export const deposit = pgTable('deposit', {
    id: id,
    warehouseReceiptId: integer().references(() => warehouseReceipt.id),
    depositorId: text().notNull(),
    costProfile: varchar("cost_profile", { length: 255 }).notNull(),
    incomingBags: integer("incoming_bags").notNull(),
    moisture: decimal("moisture", { precision: 5, scale: 2 }).notNull(),
    deductions: decimal("deductions", { precision: 5, scale: 2 }).notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    crnImageUrl: text("crn_image_url"),
    createdAt: createdAt,
    updatedAt: updatedAt
});

export type Deposit = typeof deposit.$inferSelect
export type NewDeposit = typeof deposit.$inferInsert