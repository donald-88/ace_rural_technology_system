import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

const client = mongoose.connection.getClient()

const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db)
});