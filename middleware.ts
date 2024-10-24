import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Account, Client } from 'node-appwrite'
import { PROJECT_ID } from './lib/appwrite.config'

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID!)
const account = new Account(client)

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const session = request.cookies.get('session')

    const publicRoutes = ['/signin', '/notifications']
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)


    if (!session && !isPublicRoute) {
        // Redirect to login if no session and trying to access protected route
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (session && request.nextUrl.pathname === '/login') {
        // Redirect to dashboard if user is already logged in and tries to access login
        return NextResponse.redirect(new URL('/', request.url))
    }

    const user = true
    if (!user) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }
    console.log('middleware')
    return NextResponse.next()
}

export const config = {
    matcher: ['/'],
}