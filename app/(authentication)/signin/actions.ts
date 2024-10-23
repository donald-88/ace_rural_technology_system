import { signInUser } from "@/lib/actions/user-action"
import { UserParams } from "@/types/appwrite.types"
import { redirect } from "next/navigation"

export const signInFormAction = async (previous: any, formData: FormData) => {

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    } as UserParams

    try {
        const user = await signInUser(data)

        if (user!) redirect("/")
    } catch (error) {
        return {
            message: "Sign in failed!",
        }
    }

    return {
        message: "Sign in successful!",
    }
}