export const signInFormAction = async ( prevState: any,formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log(email, password);
    return {
        message: "Sign in successful!",
    }
}