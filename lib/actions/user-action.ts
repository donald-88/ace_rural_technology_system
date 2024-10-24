"use server"

import { UserParams } from "@/types/appwrite.types"
import { account, users } from "../appwrite.config"

export const signInUser = async (user: UserParams) => {
    try {
        const existingUser = await account.createEmailPasswordSession(user.email, user.password)
        return existingUser
    } catch (e) {
        console.log(e)
        return null
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return user
    } catch (e) {
        console.log(e)
    }
}

export const signOutUser = async () => {
    try {
        await account.deleteSession('current')
    } catch (e) {
        console.log(e)
    }
}