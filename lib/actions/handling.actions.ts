"use server"

import { revalidatePath } from "next/cache"
import Handling from "@/models/handling"
import connectDB from "../mongodb"
import { HandlingType } from "@/types"

export const createHandling = async (handling: HandlingType) => {
    try {
        await connectDB()

        const handlingFound = await Handling.findOne(handling)
        if (handlingFound) {
            return {
                success: false,
                message: "Handling already exists"
            }
        }
        const newHandling = await Handling.create(handling)
        newHandling.save()
        return JSON.parse(JSON.stringify(newHandling))
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake"
        }
    }
}

export const getHandling = async () => {
    try {
        await connectDB()
        const handlings = await Handling.find({})
        revalidatePath("/inventory/handling")
        return JSON.parse(JSON.stringify(handlings))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getHandlingById = async (intakeId: string) => {
    try {
        await connectDB()
        const handling = await Handling.findById({ intakeId: intakeId })
        return JSON.parse(JSON.stringify(handling))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteHandlingItem = async (handlingIds: string[]) => {
    try {
        await Handling.deleteMany({ intakeId: { $in: handlingIds } });
        revalidatePath("/inventory/");
        return handlingIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting handling items:", error);
        return handlingIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}