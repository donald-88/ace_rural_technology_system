import { MOCK_GRADE } from '@/constants';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

    // Add artificial delay to simulate real API latency (optional)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return response
    return new Response(JSON.stringify(MOCK_GRADE), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
        },
    });
}