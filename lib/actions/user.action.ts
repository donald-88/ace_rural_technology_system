"use server"

import { redirect } from "next/navigation"
import { createClient } from "../supabase/server"

export async function signOutUser() {
    const supabase = createClient()
    await (await supabase).auth.signOut()
    redirect("/signin")
}
