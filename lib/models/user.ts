import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "warehouse manager"],
        default: "admin",
    },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userScheme);
export default User;