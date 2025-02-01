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
import { Session } from "@/lib/auth"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    session: Session | null
}


export function AppSidebar({session, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Image src="/logo.png" priority alt="logo" width={230} height={100} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser session={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}