'use server'

import { createIntake } from "@/lib/actions/intake.actions";
import { IntakeType } from "@/types";

export async function createIntakeAction(previousState: any, formData: FormData) {

    try {
        const newIntake = await createIntake(formData as unknown as IntakeType)
        if (newIntake.message === "Error creating intake") {
            return { success: false, error: newIntake.message }
        }

        // const socket = io('http://192.168.1.133:5000', {
        //     reconnection: true,
        //     reconnectionAttempts: 5,
        //     reconnectionDelay: 1000
        // })

        // await new Promise<void>((resolve, reject) => {
        //     socket.on('connect', () => {
        //         console.log('Socket connected from server action')
        //         resolve()
        //     })

        //     socket.on('connect_error', (error) => {
        //         console.error('Socket connection error:', error)
        //         reject(error)
        //     })
        // })

        // Emit print receipt event
        // socket.emit('print_receipt', {
        //     ...intake,
        //     timestamp: new Date().toISOString()
        // })
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