import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { reason, role } = req.body
        
        const requestOTP = async () => {
            await fetch('https://api.igloodeveloper.co/igloohome/devices/{deviceId}/algopin/onetime', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer 123',
                    'Content-Type': 'application/json',
                    Accept: 'application/json, application/xml'
                  },
                body: '{"variance":1,"startDate":"2022-01-01T00:00:00+08:00","accessName":"Maintenance guy"}'
            })
        }
        res.status(200).json({ message: 'Request sent successfully' })
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }

}