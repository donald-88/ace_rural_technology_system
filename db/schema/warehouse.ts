import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const warehouse = pgTable('warehouse', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
});