"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

type ActionResponse = {
    message: string;
    error?: unknown;
};

export const signInFormAction = async (
    previous: ActionResponse | undefined,
    formData: FormData
): Promise<ActionResponse> => {

    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const user = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (user) {
            redirect("/")
        } else {
            return {
                error: "Invalid credentials",
                message: "Sign in failed!",
            };
        }
    } catch (e) {
        if (e instanceof Error && e.message.startsWith('NEXT_REDIRECT')) {
            // This is the redirect, let it propagate
            throw e;
        }
        return { message: "An unexpected error occurred" };
    }
};