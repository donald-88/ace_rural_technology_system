"use client"


import { createAuthClient } from "better-auth/react"
const { useSession } = createAuthClient()

export function getUser() {
    const {
        data: session,
        isPending, //loading state
        error, //error object 
        refetch //refetch the session
    } = useSession()
    return (
        session?.user
    )
}