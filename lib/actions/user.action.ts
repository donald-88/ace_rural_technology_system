"use server"
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../mongodbClient";
import bcrypt from 'bcrypt';

// Define interfaces for better type safety
interface UserData {
    email: string;
    password: string;
    // Add other user fields as needed
}

interface SessionPayload {
    user: Omit<UserData, 'password'>;
    expires: number;
}

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)
// Session duration in milliseconds (12 hours)
const SESSION_DURATION = 12 * 60 * 60 * 1000

export async function encrypt(payload: SessionPayload): Promise<string> {
    const expirationTime = new Date(Date.now() + SESSION_DURATION)
    // Convert SessionPayload to a plain object that satisfies JWTPayload
    const jwtPayload = {
        ...payload,
        [Symbol.iterator]: undefined // This makes it a non-iterator object
    } as const

    return await new SignJWT(jwtPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    // First cast to unknown, then to SessionPayload
    return payload as unknown as SessionPayload
}

export async function signin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const client = await clientPromise
    const db = client.db("ace_rural_technology_system")
    const users = db.collection<UserData>("users")
    const user = await users.findOne({ email: email })

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log("Invalid password");
        throw new Error("Invalid password");
    }

    const { password: removedPassword, ...userWithoutPassword } = user;

    const expires = new Date(Date.now() + SESSION_DURATION)
    const session = await encrypt({
        user: userWithoutPassword,
        expires: expires.getTime()
    })

    cookies().set('session', session, { expires, httpOnly: true })
    console.log("User signed in:", userWithoutPassword);
    return userWithoutPassword
}

export async function signout() {
    cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
    const session = cookies().get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession(_request: NextRequest) {
    const session = cookies().get('session')?.value
    if (!session) return

    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + SESSION_DURATION).getTime()

    const res = NextResponse.next()
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: new Date(parsed.expires),
    })
    return res
}