import { getCurrentDateFormatted } from "@/lib/utils";
import { NextResponse } from "next/server";

type RequestBody = {
  deviceId: string;
};

type CodeResponse = {
  code: number;
  startDate: string;
  endDate: string;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { deviceId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { success: false, message: "Device ID is required" },
        { status: 400 }
      );
    }

    const code = await fetchMonthlyCode(deviceId);

    return NextResponse.json({
      success: true,
      code
    });
  } catch (error) {
    console.error("Error fetching code:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Error fetching code" },
      { status: 500 }
    );
  }
}


async function fetchMonthlyCode(deviceId: string): Promise<CodeResponse> {
    try {
      const credentials = Buffer.from(
        `${process.env.IGLOOHOME_CLIENT_ID}:${process.env.IGLOOHOME_CLIENT_SECRET}`
      ).toString("base64");
  
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", process.env.IGLOOHOME_CLIENT_ID!);
      params.append("client_secret", process.env.IGLOOHOME_CLIENT_SECRET!);
  
      // Fetch token
      const tokenResponse = await fetch(
        "https://auth.igloohome.co/oauth2/token",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params
        }
      );
  
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || "Failed to fetch access token");
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      const { startDate, endDate } = getCurrentDateFormatted();
  
      const requestData = {
        variance: 1,
        startDate,
        endDate,
        accessName: "Warehouse Manager"
      };
  
      // Fetch monthly code
      const codeResponse = await fetch(
        `https://api.igloodeveloper.co/igloohome/devices/${deviceId}/algopin/daily`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json, application/xml",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        }
      );
  
      if (!codeResponse.ok) {
        const errorData = await codeResponse.json();
        throw new Error(errorData.error || "Failed to fetch code");
      }
  
      const codeData = await codeResponse.json();
      const code = Number(codeData.pin); // Assuming the field is `pin`
  
      return { code, startDate, endDate };
    } catch (error) {
      console.error("Error fetching code:", error);
      throw error;
    }
  }
  