"use server"

import { connectMongoDB } from "@/lib/mongodb"
import { Users } from "@/models/teamMembers"

export const signUpFormAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    await connectMongoDB()

    await Users.create({
        email: email,
        password: password,
    })

    console.log(email, password, confirmPassword)

    return {
        message: "Sign up successful!",
    }
}