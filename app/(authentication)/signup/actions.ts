"use server"

type SignUpState = {
    // Define the expected properties of prevState if you know them, e.g.:
    email: string;
    password: string;
    // Add more fields as needed
};

// If you know the structure of prevState, replace `unknown` with its type:
export const signUpFormAction = async (prevState: SignUpState | unknown, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log(email, password, confirmPassword);

    return {
        message: "Sign up successful!",
    };
};
