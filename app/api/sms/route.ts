import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { to, message }: { to: string; message: string } = await req.json();

        if (!to || !message) {
            return NextResponse.json({ error: "Missing 'to' or 'message' parameters" }, { status: 400 });
        }

        const params = new URLSearchParams({
            username: process.env.BUDGETSMS_USERNAME || "",
            userid: process.env.BUDGETSMS_USERID || "",
            handle: process.env.BUDGETSMS_HANDLE || "",
            msg: message,
            from: process.env.BUDGETSMS_SENDER_ID || "ACE",
            to
        });

        const response = await fetch(`https://api.budgetsms.net/sendsms/?${params.toString()}`);
        const result = await response.text();

        return NextResponse.json({ success: true, response: result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send SMS", details: (error as Error).message }, { status: 500 });
    }
}