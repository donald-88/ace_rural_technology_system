export async function GET() {
    try {
        // Encode client credentials for Basic Auth
        const credentials = Buffer.from(`${process.env.IGLOOHOME_CLIENT_ID}:${process.env.IGLOOHOME_CLIENT_SECRET}`).toString('base64');

        // URLSearchParams for body parameters
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.IGLOOHOME_CLIENT_ID!);
        params.append('client_secret', process.env.IGLOOHOME_CLIENT_SECRET!);

        // Fetch access token
        const tokenResponse = await fetch("https://auth.igloohome.co/oauth2/token", {
            method: "POST",
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(errorData.error || 'Failed to fetch access token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch devices (✅ FIX: Changed to GET request)
        const deviceInfoResponse = await fetch(`https://api.igloodeveloper.co/igloohome/devices`, {
            method: 'GET', // ✅ Fix: Use GET for retrieving devices
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json, application/xml',
                'Content-Type': 'application/json',
            },
        });

        if (!deviceInfoResponse.ok) {
            const deviceError = await deviceInfoResponse.json();
            throw new Error(deviceError.error || 'Failed to fetch device info');
        }

        const devicesData = await deviceInfoResponse.json(); // ✅ Ensure JSON is properly 

        return new Response(JSON.stringify(devicesData.payload), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching devices:', error);
        return new Response('Error fetching devices', {
            status: 500,
        });
    }
}