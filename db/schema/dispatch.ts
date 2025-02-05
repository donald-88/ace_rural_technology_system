import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { deposit } from "./deposit";

export const dispatch = pgTable('dispatch', {
    id: text().primaryKey(),
    depositId: text().references(() => deposit.id),
    clientId: text().notNull(),
    drawDownId: text().notNull(),
    noOfBags: integer().notNull(),
    grossWeight: integer().notNull(),
    netWeight: integer().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});