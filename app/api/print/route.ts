import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Restructure the data to match Python server expectations
        const printData = {
            currentWeight: data.grossWeight, // Use grossWeight from the request
            totalWeight: data.netWeight,
            formData: {
                name: data.name,
                noOfBags: data.noOfBags,
                moisture: data.moisture,
                deductions: data.deductions,
                costProfile: data.costProfile,
                warehouseReceiptNumber: data.warehouseReceiptNumber,
            },
        };

        console.log('Sending to print server:', printData);

        const response = await fetch('http://192.168.137.150:5000/print', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(printData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Print server error:', errorText);
            throw new Error(`Print server error: ${response.status} ${response.statusText}`);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: unknown) {
        console.error('Print error:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}