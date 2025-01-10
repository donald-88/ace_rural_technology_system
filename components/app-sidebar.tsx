"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { sidebarData } from "@/constants"
import Image from "next/image"
import { getSession } from "@/lib/actions/user.action"

export async function getCurrentUser(){
    const session = await getSession()
    return session.user
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Image src="/logo.png" priority alt="logo" width={230} height={100} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
