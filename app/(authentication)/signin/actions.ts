"use server";

import { signInUser } from "@/lib/actions/user-action";
import { UserParams } from "@/types/appwrite.types";
import { redirect } from "next/navigation";

type ActionResponse = {
    message: string;
    error?: unknown;
};

export const signInFormAction = async (
    previous: ActionResponse | undefined,
    formData: FormData
): Promise<ActionResponse> => {
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    } as UserParams;

    try {
        const user = await signInUser(data);
        if (user){
            redirect("/")
        } else {
            return {
                message: "Invalid credentials!",
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