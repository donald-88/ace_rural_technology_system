'use server'

import { createIntake } from "@/lib/actions/inventory.actions";
import { IntakeParams } from "@/types";
import { io } from 'socket.io-client'

export async function createIntakeAction(previousState: any, formData: FormData) {
    const intake: IntakeParams = {
        clientName: formData.get("name") as string,
        phone: Number(formData.get("phone")),
        address: formData.get("address") as string,
        bank: 'National Bank',
        accountName: formData.get("accountName") as string,
        accountNumber: Number(formData.get("accountNumber")),
        amount: Number(formData.get("amount")),
        commodity: formData.get("commodity") as string,
        variety: formData.get("variety") as string,
        grade: Number(formData.get("grade")),
        price: Number(formData.get("price")),
        netWeight: Number(formData.get("netWeight")),
        grossWeight: Number(formData.get("grossWeight")),
        moistureIn: Number(formData.get("moisture")),
        deductions: Number(formData.get("deductions")),
        numberOfBags: Number(formData.get("noOfBags")),
        bagsReturned: Number(formData.get("bagsReturned")),
        status: 'InStorage',
    }

    console.log(intake)

    try {
        const newIntake = await createIntake(intake)
        if (newIntake.message === "Error creating intake") {
            return { success: false, error: newIntake.message }
        }

        const socket = io('http://192.168.1.133:5000', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        })

        await new Promise<void>((resolve, reject) => {
            socket.on('connect', () => {
                console.log('Socket connected from server action')
                resolve()
            })

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error)
                reject(error)
            })
        })

        // Emit print receipt event
        socket.emit('print_receipt', {
            ...intake,
            timestamp: new Date().toISOString()
        })
        return { success: true, data: newIntake }
    }
    catch (error) {
        console.error("Error creating intake:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create intake"
        }
    }
}