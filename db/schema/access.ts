import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

export const access = pgTable("access", {
    id: text('id').primaryKey(),
    userId: text("user_id").references(() => user.id).notNull(),
    lockId: text("lock_id").notNull(),
    otp: integer("otp").notNull(),
    reason: text("reason").notNull(),
    accessedTime: timestamp({ withTimezone: true }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
})

export const accessRelations = relations(access, ({ one }) => ({
    user: one(user, {
        fields: [access.userId],
        references: [user.id]
    })
}))

export type Access = typeof access.$inferSelect
export type NewAccess = typeof access.$inferInsert