"use server";

import { signin } from "@/lib/actions/user.action";
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
        const user = await signin(formData);
        if (user) {
            redirect("/")
        } else {
            return {
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