'use server'

import clientPromise from "../mongodbClient"

export const getClients = async () => {

    try {
        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const clientsCollection = db.collection('clients')
        const clients = await clientsCollection.find({}).toArray()

        return JSON.parse(JSON.stringify(clients))
    } catch (error) {
        console.error("Error getting clients:", error)
        return {
            message: "Error getting clients",
        }
    }
}