import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// List of public routes that don't require authentication
const publicRoutes = ['/signin']

// Use the same secret key as in your auth system
const secretKey = new TextEncoder().encode('secret') // Replace 'secret' with your actual secret key

async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secretKey, {
            algorithms: ["HS256"],
        })
        return payload
    } catch {
        return null
    }
}

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const pathname = request.nextUrl.pathname

    // Allow access to public routes without authentication
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    // If no session exists, redirect to signin
    if (!session) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    try {
        // Verify the session token
        const payload = await verifyToken(session)

        if (!payload || new Date(payload.expires as string) < new Date()) {
            throw new Error('Session expired')
        }

        return NextResponse.next()
    } catch (error) {
        // If session is invalid, redirect to signin
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public|signin).*)',
    ],
}