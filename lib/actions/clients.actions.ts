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

export const getClientById = async (id: string) => {
    try {
        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const clientsCollection = db.collection('clients')
        const clientDetails = await clientsCollection.findOne({ customer_id: id })

        return JSON.parse(JSON.stringify(clientDetails))
    } catch (error) {
        console.error("Error getting client details:", error)
        return {
            message: "Error getting client details",
        }
    }
}