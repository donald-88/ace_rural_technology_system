"use server"

import { revalidatePath } from "next/cache"
import { IntakeParams } from "@/types"
import clientPromise from "../mongodbClient"

export const createIntake = async (intake: IntakeParams) => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const intakeCollection = db.collection('intakes')
        const newIntake = await intakeCollection.insertOne(intake)
        return JSON.parse(JSON.stringify(newIntake))
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake"
        }
    }
}

export const getIntake = async () => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const intakeCollection = db.collection('intakes')
        const intake = await intakeCollection.find({}).toArray()

        revalidatePath("/inventory")
        return intake

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getIntakeById = async (intakeId: string) => {
    try {

        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const intakeCollection = db.collection('intakes')

        const intake = await intakeCollection.findOne({ id: intakeId })

        return JSON.parse(JSON.stringify(intake))
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteIntakeItem = async (intakeId: string) => {
    try {

        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const intakeCollection = db.collection('intakes')
        const deletedIntake = await intakeCollection.deleteOne({ id: intakeId })

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