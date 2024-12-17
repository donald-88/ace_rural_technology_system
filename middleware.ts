import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

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