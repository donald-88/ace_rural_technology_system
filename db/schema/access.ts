import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";
import { relations } from "drizzle-orm";
import { createdAt, updatedAt } from "../schema-helper";

export const access = pgTable("access", {
    id: text('id').primaryKey(),
    userId: text("user_id").references(() => user.id).notNull(),
    lockId: text("lock_id").notNull(),
    code: integer("code").notNull(),
    reason: text("reason").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
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