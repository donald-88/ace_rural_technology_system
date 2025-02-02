import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/signin"];
const passwordRoutes = ["/reset-password", "/forgot-password"];

export default async function authMiddleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const isAuthRoute = authRoutes.includes(pathName);
    const isPasswordRoute = passwordRoutes.includes(pathName);

    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!session) {
        if (isAuthRoute || isPasswordRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Restrict access to "/" for non-admin users
    if (pathName === "/" && session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/warehouse", request.url));
    }

    if (isAuthRoute || isPasswordRoute) {
        if (session.user.role === "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.redirect(new URL("/warehouse", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
