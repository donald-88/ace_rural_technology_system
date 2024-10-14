"use client"

import React from 'react';
import Image from 'next/image';
import { sidebarLinks } from '@/constants';
import UserItem from './userItem';
import MenuItem from './menuItem';

// Define the type for a sidebar link
type SidebarLink = {
    name: string;
    icon: React.ReactNode;
    path: string;
    subMenu?: boolean;
    subMenuItems?: Array<{
        name: string;
        path: string;
    }>;
};

const Sidebar: React.FC = () => {
    return (
        <aside className="w-[300px] h-screen overflow-hidden border-r border-gray-200">
            <nav className="h-full overflow-y-auto py-4 px-2 flex flex-col justify-between">
                <div>
                    <Image src="/logo.png" priority alt="logo" width={230} height={100} />
                    <ul className="mt-4">
                        {sidebarLinks.map((link: SidebarLink) => (
                            <MenuItem link={link} />
                        ))}
                    </ul>
                </div>
                <UserItem />
            </nav>
        </aside>
    );
};

export default Sidebar;