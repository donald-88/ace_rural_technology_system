import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const depositor = pgTable('depositor', {
    id: text().primaryKey(),
    name: text().notNull(),
    address: text().notNull(),
    phone_number: text().notNull(),
    email: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});