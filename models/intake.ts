import mongoose, { Document, Model, Schema } from "mongoose";

interface IIntake extends Document {
    intakeId: string
    clientId: string
    amount: number
    commodity: string
    variety: string
    grade: number
    price: number
    grossWeight: number
    netWeight: number
    deductions: number
    moistureIn: number
    bagIds: Array<string>
}

const IntakeSchema = new Schema<IIntake>({
    intakeId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
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
    price: {
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
        default: 0,
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
    bagIds: {
        type: [String],
        required: true,
        default: [],
    },
}, {
    collection: "intake",
    timestamps: true
})

const Intake: Model<IIntake> = mongoose.models.Intake || mongoose.model<IIntake>("Intake", IntakeSchema)

export default Intake