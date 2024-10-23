"use server"


export const signUpFormAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    console.log(email, password, confirmPassword)

    return {
        message: "Sign up successful!",
    }
}