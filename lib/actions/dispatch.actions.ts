"use server"

import { revalidatePath } from "next/cache"
import { IntakeParams } from "@/types"
import clientPromise from "../mongodbClient"
import { ObjectId } from "mongodb"

export const createDispatch = async (dispatch: IntakeParams) => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const dispatchCollection = db.collection('dispatch')

        const newDispatch = await dispatchCollection.insertOne(dispatch)
        return newDispatch
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake"
        }
    }
}

export const getDispatch = async () => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const dispatchCollection = db.collection('dispatch')

        const dispatches = await dispatchCollection.find({}).toArray()
        revalidatePath("/inventory")
        return dispatches

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getDispatchById = async () => {
    try {
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteDispatchItem = async (dispatchId: string) => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const dispatchCollection = db.collection('dispatch')
        const deletedDispatch = await dispatchCollection.deleteOne({ _id: new ObjectId(dispatchId) })
        
        revalidatePath("/inventory")
        return {
            message: "Intake deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting intake:", error)
        return {
            message: "Error deleting intake",
        }
    }
}