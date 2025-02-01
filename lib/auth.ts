import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthClient } from "better-auth/react"


export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // the base url of your auth server
})

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    })
});