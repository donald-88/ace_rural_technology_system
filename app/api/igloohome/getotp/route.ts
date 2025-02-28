import { getCurrentDateFormatted } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { deviceId } = body

        if (!deviceId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Device ID is required',
                },
                {
                    status: 400,
                }
            )
        }

        const otp = await fetchOTPFromService(deviceId)

        return NextResponse.json({
            success: true,
            deviceId,
            otp
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching OTP' },
            { status: 500 }
        );
    }
}

async function fetchOTPFromService(deviceId: string): Promise<string> {
    try {
        // Encode client credentials for Basic Auth
        const credentials = Buffer.from(`${process.env.IGLOOHOME_CLIENT_ID}:${process.env.IGLOOHOME_CLIENT_SECRET}`).toString('base64');

        // URLSearchParams for body parameters
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.IGLOOHOME_CLIENT_ID!);
        params.append('client_secret', process.env.IGLOOHOME_CLIENT_SECRET!);

        // Make the fetch request to get the token
        const tokenResponse = await fetch("https://auth.igloohome.co/oauth2/token", {
            method: "POST",
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        // Log the raw response text to debug before consuming it
        const rawResponse = await tokenResponse.text();
        // console.log('Raw response:', rawResponse);  // Log the raw response body

        // Check if the response is successful
        if (!tokenResponse.ok) {
            const errorData = JSON.parse(rawResponse);  // Parse the raw response if it's an error
            throw new Error(errorData.error || 'Failed to fetch access token');
        }

        // Parse the JSON response to extract the access token
        const tokenData = JSON.parse(rawResponse);  // Use the raw response to parse JSON
        const accessToken = tokenData.access_token;


        // get the algo one time pin
        const oneTimePinRequestData = {
            variance: 1,
            startDate: getCurrentDateFormatted(),
            accessName: "Maintenance guy"
        };

        const otpResponse = await fetch(`https://api.igloodeveloper.co/igloohome/devices/${deviceId}/algopin/onetime`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json, application/xml',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(oneTimePinRequestData),
        });

        // Log the OTP response body
        const otpResponseText = await otpResponse.text();

        if (!otpResponse.ok) {
            const otpErrorData = JSON.parse(otpResponseText);
            throw new Error(otpErrorData.error || 'Failed to fetch one-time PIN');
        }

        const otpData = JSON.parse(otpResponseText);  // Use the raw OTP response to parse JSON
        const oneTimePin = otpData.pin;  // Assuming the response includes a `pin` field

        // Return the one-time PIN in the response
        return oneTimePin
    } catch (error) {
        // Handle any errors
        console.error('Error fetching token:', error);
        throw error
    }
}