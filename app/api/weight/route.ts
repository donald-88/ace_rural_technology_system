import { NextApiRequest, NextApiResponse } from 'next';

let currentWeight = 0;
let totalWeight = 0;

export async function POST(req: Request) {
  try {
    const { weight } = await req.json();
    currentWeight = parseFloat(weight);
    totalWeight += currentWeight;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ currentWeight, totalWeight }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}