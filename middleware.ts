import { NextResponse } from 'next/server'
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { apiAuthPrefix, authRoutes } from "./routes"

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
    const isLoggedIn = !!req.auth
    const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix)
    const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // Allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    // Redirect logged-in users from auth routes to home
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        return NextResponse.next()
    }

    // Redirect unauthenticated users to login for all other routes
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}