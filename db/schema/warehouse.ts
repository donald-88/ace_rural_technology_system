import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const warehouse = pgTable('warehouse', {
    id: text().primaryKey(),
    name: text().notNull(),
    address: text().notNull(),
});