import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";

export const handling = pgTable('handling', {
    id: text().primaryKey(),
    depositId: text().references(() => deposit.id),
    handlingType: text().notNull(),
    handlingDate: timestamp().notNull(),
    handlingBy: text().notNull(),
    handlingCost: integer().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});