import mongoose, { Document, Model, Schema } from "mongoose";

interface IAccessLogs extends Document {
    userId: string;
    otp: string;
    deviceId: string;
    reason: string;
    role: "Admin" | "Warehouse Manager";
    status: "Pending" | "Approved" | "Denied";
}

const AccessLogsSchema = new Schema<IAccessLogs>({
    userId: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Warehouse Manager"],
        required: true,
        default: "Warehouse Manager",
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Denied"],
        required: true,
        default: "Pending",
    },
}, {
    timestamps: true,
    collection: "accessLogs",
});

let AccessLogsModel: Model<IAccessLogs>;

if (mongoose.models.AccessLogs) {
    AccessLogsModel = mongoose.model<IAccessLogs>("AccessLogs");
} else {
    AccessLogsModel = mongoose.model<IAccessLogs>("AccessLogs", AccessLogsSchema);
}

export default AccessLogsModel;