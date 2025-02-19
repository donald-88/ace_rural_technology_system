"use client"

import * as React from "react"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { adminSidebarData, warehouseSidebarData } from "@/constants"
import { Session } from "@/lib/auth"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    session: Session | null
}


export function AppSidebar({ session, ...props }: AppSidebarProps) {
    const pathname = usePathname()
    const isAdmin = !pathname.includes("warehouse")
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex items-center justify-center">
                <Image src="/logo.png" priority alt="logo" width={160} height={160} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={isAdmin ? adminSidebarData.navMain : warehouseSidebarData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser session={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}