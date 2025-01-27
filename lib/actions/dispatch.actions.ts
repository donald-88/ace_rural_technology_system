"use server"

import { revalidatePath } from "next/cache"
import Dispatch from "@/models/dispatch"
import connectDB from "../mongodb"
import { DispatchType } from "@/types"

export const createDispatch = async (dispatch: DispatchType) => {
    try {
        await connectDB()

        const dispatchFound = await Dispatch.findOne(dispatch)
        if (dispatchFound) {
            return {
                success: false,
                message: "Dispatch already exists"
            }
        }
        const newDispatch = await Dispatch.create(dispatch)
        newDispatch.save()
        return JSON.parse(JSON.stringify(newDispatch))
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake"
        }
    }
}

export const getDispatch = async () => {
    try {
        await connectDB()
        const dispatches = await Dispatch.find({})
        revalidatePath("/inventory")
        return JSON.parse(JSON.stringify(dispatches))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getDispatchById = async (intakeId: string) => {
    try {
        await connectDB()
        const dispatch = await Dispatch.findById({ intakeId: intakeId })
        return JSON.parse(JSON.stringify(dispatch))
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteDispatchItem = async (dispatchIds: string[]) => {
    try {
        await Dispatch.deleteMany({ intakeId: { $in: dispatchIds } });
        revalidatePath("/inventory/");
        return dispatchIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting handling items:", error);
        return dispatchIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}