"use server";

import { Resend } from "resend";

const resend = new Resend("re_4kn3RL9M_2fjq3CSBhtuZzGcURpCdzko6");

export async function sendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) {

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            text,
        });
    } catch (error) {
        throw new Error("Failed to send email");
    }

}