"use server"

import { revalidatePath } from "next/cache"
import { IntakeParams } from "@/types"
import clientPromise from "../mongodbClient"
import { ObjectId } from "mongodb"

export const createHandling = async (handling: IntakeParams) => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const handlingCollection = db.collection('handlers')
        const newHandling = await handlingCollection.insertOne(handling)
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

        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const handlingCollection = db.collection('handlers')
        const handlings = await handlingCollection.find({}).toArray()
        revalidatePath("/inventory")
        return JSON.parse(JSON.stringify(handlings))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getHandlingById = async () => {
    try {
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteHandlingItem = async (handlingId: string) => {
    try {
        
        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const handlingCollection = db.collection('handling')

        const deletedIntake = await handlingCollection.deleteOne({ _id: new ObjectId(handlingId) })
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