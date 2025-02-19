"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Data {
  time: number;
  temperature: number;
  humidity: number;
  smoke: number;
}

const data: Data[] = [
  { time: 12, temperature: 26.3, humidity: 18.4, smoke: 32.1 },
  { time: 1, temperature: 27.1, humidity: 16.2, smoke: 28.5 },
  { time: 2, temperature: 29.2, humidity: 15.7, smoke: 27.3 },
  { time: 3, temperature: 32.5, humidity: 17.1, smoke: 26.8 },
  { time: 4, temperature: 31.2, humidity: 19.4, smoke: 28.1 },
  { time: 5, temperature: 29.4, humidity: 21.2, smoke: 29.6 },
  { time: 6, temperature: 27.8, humidity: 19.9, smoke: 27.4 },
  { time: 7, temperature: 26.1, humidity: 17.3, smoke: 25.2 },
  { time: 8, temperature: 24.5, humidity: 15.8, smoke: 22.9 },
  { time: 9, temperature: 23.8, humidity: 16.1, smoke: 21.7 },
  { time: 10, temperature: 22.4, humidity: 14.9, smoke: 20.3 },
  { time: 11, temperature: 21.7, humidity: 13.8, smoke: 19.1 },
];

export function ConditionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Sensor Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" type="number" domain={[0, 'dataMax']} />
            <YAxis yAxisId="right" type="number" domain={[0, 'dataMax']} orientation="right" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#459428" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#9B9B9B" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="smoke" stroke="#9DAC95" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
