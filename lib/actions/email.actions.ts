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
    const timestamp = new Date().toLocaleString(); // Get the current timestamp
    const messageWithTimestamp = `${text}\nSent at: ${timestamp}`; // Append the timestamp to the message text


    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            text: messageWithTimestamp, // Send the message with the timestamp
        });
    } catch (error) {
        throw new Error("Failed to send email");
    }
}


