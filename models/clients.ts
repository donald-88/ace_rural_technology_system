import mongoose, { Document, Model, Schema } from "mongoose";

interface IClient extends Document {
    clientId: string
    name: string
    address: string
    phone: string
    vehicle: string
    accountName: string
    accountNumber: string
    bank: string
}

const ClientSchema = new Schema<IClient>({
    clientId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
        required: false,
    },
    accountName: {
        type: String,
        required: false,
    },
    accountNumber: {
        type: String,
        required: false,
    },
    bank: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
})

const Client: Model<IClient> = mongoose.models.Clients || mongoose.model<IClient>("Clients", ClientSchema)

export default Client