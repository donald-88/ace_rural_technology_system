import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helper";

export const Type = pgEnum('title',['motion', 'smoke', 'humidity', 'otp'])

export const notifications = pgTable("notifications", {
    id: text("id").primaryKey(),
    title: Type('title').notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: createdAt,
    updatedAt: updatedAt
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert