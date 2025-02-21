import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Replace with your API endpoint
        const apiUrl = 'https://jsonplaceholder.typicode.com/users';

        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required authentication headers
                // 'Authorization': `Bearer ${process.env.API_KEY}`,
            },
            // Optional: Adding cache control
            cache: 'no-store', // Disable caching for fresh data
            // Alternative: Use revalidation
            // next: { revalidate: 60 }, // Revalidate every 60 seconds
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Return the data with proper status code
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('API fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from API' },
            { status: 500 }
        );
    }
}
