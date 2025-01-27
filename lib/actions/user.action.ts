"use server"

import bcrypt from "bcryptjs";
import User from "@/models/user";
import connectDB from "../mongodb";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

interface UserData {
    email: string;
    password: string;
}

export async function getUserFromDb(email: string, password: string): Promise<UserData | null> {
    try {
        await connectDB();
        const user = await User.findOne({ email: email })

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            throw new Error("Invalid password");
        }
        return user
    } catch (error) {
        throw new Error("Error getting user from database")
    }
}

export async function signOutUser() {
    console.log("Signing out user");
    await signOut()
}
