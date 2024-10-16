import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
})

export const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);