"use client"

import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from './ui/sidebar'
import Image from 'next/image'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { warehouseSidebarData } from '@/constants'

const WarehouseSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Image src="/logo.png" priority alt="logo" width={230} height={100} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={warehouseSidebarData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={warehouseSidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

export default WarehouseSidebar