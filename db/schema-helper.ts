import { customType, timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom()
export const createdAt = timestamp({ withTimezone: true }).notNull().defaultNow()
export const updatedAt = timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())

// export const formattedUUID = customType<{ data: () => string }>({
//     dataType() {
//         return "uuid"
//     },
//     toDriver(value) {
//         return value
//     },
//     fromDriver(value: string) {
//         return `MYAPP-${value}`;
//     },
// })