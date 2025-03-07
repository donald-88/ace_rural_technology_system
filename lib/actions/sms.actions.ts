export async function sendSMS(to: string, message: string) {
    const timestamp = new Date().toLocaleString(); // Current timestamp when the message is sent
    const messageWithTimestamp = `${message} - Sent at: ${timestamp}`; // Append only the current timestamp when sending

    try {
        const response = await fetch("http://localhost:3000/api/sms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to,
                message: messageWithTimestamp, // Send the message with the timestamp
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send SMS: ${response.statusText}`);
        }

        console.log("SMS sent successfully with timestamp.");
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}
