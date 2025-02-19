"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Data {
  day: string;
  value: number;
}

const data: Data[] = [
  { day: 'Mon', value: 19.7 },
  { day: 'Tue', value: 17.8 },
  { day: 'Wed', value: 17.3 },
  { day: 'Thu', value: 22.6 },
  { day: 'Fri', value: 19.5 },
  { day: 'Sat', value: 22.7 },
  { day: 'Sun', value: 23.3 },
];

export function DeviceUptimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Uptime</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
