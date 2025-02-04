import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./actions/email.actions";
import { admin, phoneNumber } from "better-auth/plugins"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your Password",
                text: `Click here to reset your password: ${url}`
            })
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, token }) => {
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`
            await sendEmail({
                to: user.email,
                subject: "Verify your Email",
                text: `Click here to verify your email: ${verificationUrl}`
            })
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification
        },
    }),
    plugins: [
        admin(),
        phoneNumber()
    ]
});

export type Session = typeof auth.$Infer.Session;