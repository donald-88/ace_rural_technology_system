import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format current date in the required format (yyyy-MM-dd'T'HH:mm:ssZ)
export function getCurrentDateFormatted() {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Get the time zone offset in minutes
  const sign = offset > 0 ? '-' : '+';
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:00:00${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  // Create end date by adding 30 days
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 30);
  
  const endDateFormatted = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:00:00${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  return { startDate, endDate: endDateFormatted };
}


export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "k";
  }
  return value.toString();
}

export const calculatePieChartData = (commodities: { seed: string; quantity: number; fill: string }[]) => {
  const totalBags = commodities.reduce((sum, item) => sum + item.quantity, 0);
  return commodities.map(item => ({
    ...item,
    percentage: totalBags > 0 ? ((item.quantity / totalBags) * 100).toFixed(1) + "%" : "0%",
    // Original quantity is already included in the item object, so no need to modify it
  }));
};


export function getInitials(name: string): string {
  if (!name) return '';
  const nameParts = name.trim().split(/\s+/);
  return nameParts.length === 1
    ? nameParts[0].charAt(0).toUpperCase()
    : nameParts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
}

// ===================== AUTOMATIC LOGIN & TOKEN HANDLING =====================

const IPC_IP = process.env.IPC_IP || "http://168.253.229.53:80";
const CAMERA_USERNAME = "admin";
const CAMERA_PASSWORD = "ACE20242025";
const NOTIFICATION_API = process.env.NOTIFICATION_API || "http://localhost:3000/api/notifications";

let cachedToken: string | null = null;
let tokenTimestamp: number = 0; // Time when the token was acquired

export const getCameraToken = async () => {
  try {
    // If we have a cached token and it's less than 1 hour old, reuse it.
    if (cachedToken && Date.now() - tokenTimestamp < 3600000) {
      return cachedToken;
    }

    const loginUrl = `${IPC_IP}/api.cgi?cmd=Login`;
    console.log("Logging in to get token...");

    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          cmd: "Login",
          param: {
            User: {
              Version: "0",
              userName: CAMERA_USERNAME,
              password: CAMERA_PASSWORD,
            },
          },
        },
      ]),
    });

    if (!response.ok) {
      console.error(`Login failed with status: ${response.status}`);
      throw new Error("Failed to authenticate with the camera");
    }

    const data = await response.json();
    console.log("Login API response:", data);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response structure");
    }
    if (data[0].code !== 0) {
      throw new Error(`Login failed with code ${data[0].code}: ${data[0].error?.detail}`);
    }
    if (!data[0].value || !data[0].value.Token || !data[0].value.Token.name) {
      throw new Error("Camera API did not return a valid token");
    }

    cachedToken = data[0].value.Token.name;
    tokenTimestamp = Date.now(); // Record the time when the token was acquired
    console.log("New token acquired:", cachedToken);
    return cachedToken;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};


// ===================== MOTION DETECTION & AUTO NOTIFICATIONS =====================

let lastNotificationTime = 0; // Timestamp for cooldown
let lastMotionState = false;    // Global variable to store the last motion state
let lastWebhookTime = Date.now(); // Stores last webhook event timestamp
const COOLDOWN_PERIOD = 3600000; // 60 minutes cooldown
const POLLING_TIMEOUT = 30 * 60 * 1000; // 30 minutes before polling starts

let pollingInterval: NodeJS.Timeout | null = null; // Store polling interval


export const checkMotionState = async () => {
  try {
    const token = await getCameraToken();
    if (!token) throw new Error("No valid token available");

    const url = `${IPC_IP}/api.cgi?cmd=GetMdState&channel=0&token=${token}`;
    console.log("Checking motion state at:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Camera API responded with status: ${response.status}`);

    const data = await response.json();
    console.log("Motion state response:", data);
    const detected = data[0]?.value?.state === 1;
    lastMotionState = detected;
    return detected;
  } catch (error) {
    console.error("Error fetching motion state:", error);
    return false;
  }
};

export const sendMotionAlert = async () => {
  try {
    const motionData = {
      deviceType: "camera",
      deviceId: "IPC001",
      eventType: "motion",
      timestamp: new Date().toISOString(),
    };

    console.log("Sending motion notification:", motionData);

    const response = await fetch(NOTIFICATION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(motionData),
    });

    if (!response.ok) {
      throw new Error(`Notification API responded with status: ${response.status}`);
    }

    console.log("Motion notification sent successfully.");
  } catch (error) {
    console.error("Error sending motion notification:", error);
  }
};

export const startMotionMonitoring = () => {
  if (pollingInterval) {
    console.log("Polling is already running, skipping...");
    return;
  }

  pollingInterval = setInterval(async () => {
    const now = Date.now();
    const currentHour = new Date().getHours();

    // Start polling if NO webhooks received in the last 30 minutes
    if (now - lastWebhookTime >= POLLING_TIMEOUT) {
      if (currentHour >= 18 || currentHour < 6) {
        console.log("🔄 No webhooks received, switching to polling...");
        const motionDetected = await checkMotionState();

        if (motionDetected && now - lastNotificationTime > COOLDOWN_PERIOD) {
          console.log("Motion detected! Sending alert...");
          await sendMotionAlert();
          lastNotificationTime = now;
        } else if (motionDetected) {
          console.log("Motion detected but cooldown is active.");
        }
      } else {
        console.log("Outside of scheduled hours, skipping polling...");
      }
    } else {
      console.log("✅ Webhook recently received, skipping polling...");
    }
  }, 5000); // Check every 5 seconds
};

// Stop polling when a webhook is received
export const stopMotionMonitoring = () => {
  if (pollingInterval) {
    console.log("🚫 Webhook received, stopping polling...");
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Optionally, export lastWebhookTime for debugging
export { lastWebhookTime };