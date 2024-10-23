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
        if (user) redirect("/");
    } catch (error) {
        return {
            message: "Sign in failed!",
            error: error
        };
    }

    return {
        message: "Sign in successful!",
    };
};