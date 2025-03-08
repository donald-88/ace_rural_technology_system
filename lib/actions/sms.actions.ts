export const sendSMS = async (to: string, message: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/sms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: to, message: message })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        return response;
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}