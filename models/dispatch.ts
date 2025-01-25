import mongoose, { Document, Model, Schema } from "mongoose";

interface IDispatch extends Document {
    intakeId: string;
    handlingReferenceId: string;
    clientId: string;
    commodityDetails: any;
    volumeThroughWeighingScale: number;
    moistureThroughMoistureMeter: number;
    barCodeGeneration: string;
    printing: boolean;
    outgoingBagCountViaCameras: number;
    createdAt: Date;
}

const DispatchSchema = new Schema<IDispatch>({
    intakeId: {
        type: String,
        required: true,
    },
    handlingReferenceId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    commodityDetails: {
        type: Object,
        required: true,
    },
    volumeThroughWeighingScale: {
        type: Number,
        required: true,
    },
    moistureThroughMoistureMeter: {
        type: Number,
        required: true,
    },
    barCodeGeneration: {
        type: String,
        required: true,
    },
    printing: {
        type: Boolean,
        required: true,
    },
    outgoingBagCountViaCameras: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    collection: "dispatches",
});

let DispatchModel: Model<IDispatch>;

if (mongoose.models.Dispatch) {
    DispatchModel = mongoose.model<IDispatch>("Dispatch");
} else {
    DispatchModel = mongoose.model<IDispatch>("Dispatch", DispatchSchema);
}

export default DispatchModel;