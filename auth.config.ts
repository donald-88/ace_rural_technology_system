import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import User from "./models/user"
import bcrypt from "bcryptjs"
import connectDB from "./lib/mongodb"

export default {
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    await connectDB()

                    // Find the user by email
                    const user = await User.findOne({ email: credentials?.email });

                    if (!user) {
                        throw new Error('Invalid credentials');
                    }

                    // Check if the password is correct
                    const isPasswordValid = await bcrypt.compare(credentials?.password as string ?? '', user.password);
                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    }
                    return user
                } catch (error) {
                    throw new Error('Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email ?? '',
                    name: token.name ?? null,
                    image: token.picture ?? null,
                    emailVerified: null,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig