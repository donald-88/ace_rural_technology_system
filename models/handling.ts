import mongoose, { Document, Model, Schema } from "mongoose";

interface IHandling extends Document {
    handlingId: string
    intakeId: string
    commodity: string
    variety: string
    grade: number
    grossWeight: number
    netWeight: number
    deductions: number
    moistureIn: number
    bagsOut: number
    bagsIn: number
    createdAt: Date
}

const HandlingSchema = new Schema<IHandling>({
    handlingId: {
        type: String,
        required: true,
    },
    intakeId: {
        type: String,
        required: true,
    },
    commodity: {
        type: String,
        required: true,
    },
    variety: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    grossWeight: {
        type: Number,
        required: true,
        default: 0,
    },
    netWeight: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        required: true,
        default: 0,
    },
    moistureIn: {
        type: Number,
        required: true,
        default: 0,
    },
    bagsOut: {
        type: Number,
        required: true,
        default: 0,
    },
    bagsIn: {
        type: Number,
        required: true,
    },
}, {
    collection: "handling",
    timestamps: true,
})

const Handling: Model<IHandling> = mongoose.models.Handling || mongoose.model<IHandling>("Handling", HandlingSchema);

export default Handling