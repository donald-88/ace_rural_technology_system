export const signInFormAction = async ( formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log(email, password);
    return {
        message: "Sign in successful!",
    }
}