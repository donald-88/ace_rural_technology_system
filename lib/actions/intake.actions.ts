"use server"

import Intake from "@/models/intake"
import connectDB from "../mongodb"
import { IntakeType } from "@/types"
import Client from "@/models/clients"

export const createIntake = async (intake: IntakeType) => {
    try {
        await connectDB()
        const intakeFound = await Intake.findOne(intake)
        if (intakeFound) {
            return {
                message: "Intake already exists"
            }
        }

        const newIntake = await Intake.create(intake)
        newIntake.save()
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
        await connectDB();
        // Fetch all intakes
        const intakes = await Intake.find({});

        // Map client names
        const clients = await Client.find({}); // Fetch all clients
        const clientMap = clients.reduce((acc, client) => {
            acc[client.clientId] = client.name;
            return acc;
        }, {} as Record<string, string>);

        // Add client names to intakes
        const intakesWithNames = intakes.map((intake) => ({
            ...intake.toObject(),
            clientName: clientMap[intake.clientId] || "Unknown Client",
        }));
        return JSON.parse(JSON.stringify(intakesWithNames));
    } catch (error) {
        console.error("Error getting intake:", error);
        return {
            message: "Error getting intake",
        };
    }
};

export const getIntakeById = async (intakeId: string) => {
    try {
        await connectDB()
        const intake = await Intake.findOne({ intakeId: intakeId })

        return JSON.parse(JSON.stringify(intake))
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export async function deleteIntakeItems(inventoryItemIds: string[]) {
    try {
        await Intake.deleteMany({ intakeId: { $in: inventoryItemIds } });
        return inventoryItemIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting intake items:", error);
        return inventoryItemIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}