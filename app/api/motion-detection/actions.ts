import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

type Data = {
  message: string;
  result?: any;
};

// Helper function for making API calls
const makeCameraApiCall = async (url: string, payload: any) => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // To handle self-signed certificates
  return axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { action } = req.query;
  const cameraIP = process.env.CAMERA_IP;
  const cameraUsername = process.env.CAMERA_USERNAME;
  const cameraPassword = process.env.CAMERA_PASSWORD;
  const notificationApiUrl = process.env.NOTIFICATION_API_URL;

  // Validate required environment variables
  if (!cameraIP || !cameraUsername || !cameraPassword || !notificationApiUrl) {
    return res.status(500).json({ message: 'Missing required environment variables.' });
  }

  // Log received action for debugging
  console.log('Action received:', action);

  // Login and get token
  const getToken = async () => {
    try {
      const response = await makeCameraApiCall(`https://${cameraIP}/api.cgi?cmd=Login`, [
        {
          cmd: 'Login',
          param: {
            User: {
              Version: '0',
              userName: cameraUsername,
              password: cameraPassword,
            },
          },
        },
      ]);
      return response.data[0]?.value?.Token?.name;
    } catch (error) {
      throw new Error('Failed to retrieve token from the camera.');
    }
  };

  try {
    // Obtain token
    const token = await getToken();
    if (!token) {
      throw new Error('Failed to obtain token.');
    }

    // Handle actions
    if (action === 'setMdAlarm') {
      // Configure motion detection
      console.log('Configuring motion detection...');
      const payload = [
        {
          cmd: 'SetMdAlarm',
          param: {
            MdAlarm: {
              channel: 0,
              scope: {
                cols: 120,
                rows: 67,
                table: '1'.repeat(120 * 67), // Full detection grid
              },
              sens: [
                {
                  beginHour: 0,
                  beginMin: 0,
                  endHour: 23,
                  endMin: 59,
                  id: 0,
                  sensitivity: 9,
                },
              ],
              type: 'md',
              priority: 0,
            },
          },
        },
      ];

      const response = await makeCameraApiCall(
        `https://${cameraIP}/api.cgi?cmd=SetMdAlarm&token=${token}`,
        payload
      );

      console.log('Motion detection response:', response.data);
      return res.status(200).json({ message: 'Motion detection configured successfully.', result: response.data });
    }

    if (action === 'setPush') {
      // Configure push notifications
      console.log('Configuring push notifications...');
      const payload = [
        {
          cmd: 'SetPush',
          param: {
            Push: {
              enable: 1,
              url: notificationApiUrl,
              method: 'POST',
              content: {
                type: 'motion_detected',
                channel: 0,
                timestamp: new Date().toISOString(), // Current timestamp
              },
            },
          },
        },
      ];

      const response = await makeCameraApiCall(
        `https://${cameraIP}/api.cgi?cmd=SetPush&token=${token}`,
        payload
      );

      console.log('Push notification response:', response.data);
      return res.status(200).json({ message: 'Push notifications configured successfully.', result: response.data });
    }

    // If the action is not recognized
    console.error('Unknown action received:', action);
    return res.status(400).json({ message: `Unknown action: ${action}` });
  } catch (error: any) {
    console.error('Error in action.ts:', error.message);
    return res.status(500).json({ message: 'Error processing request.', result: error.message });
  }
}

