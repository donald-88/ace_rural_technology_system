"use server"

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../mongodbClient";

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("10 sec from now")
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    return payload

}

export async function signin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const client = await clientPromise

    const db = client.db("ace_rural_technology_system")
    const users = db.collection("users")

    const user = await users.findOne({ email: email })

    // Verify user and password
    if (!user) {
        throw new Error("User not found");
    }

    const bcrypt = require('bcrypt');

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    // Remove sensitive information
    const { password: _, ...userWithoutPassword } = user;

    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const session = await encrypt({ user: userWithoutPassword, expires })

    cookies().set('session', session, { expires, httpOnly: true })

    return userWithoutPassword

}

export async function signout() {
    // delete session cookie
    cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
    const session = cookies().get('session')?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
    const session = cookies().get('session')?.value
    if (!session) return

    //refresh session so that it doesnt expire
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 10 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    })
    return res
}