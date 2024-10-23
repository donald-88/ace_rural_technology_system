"use client"
import React from 'react'
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

const Header = () => {
    const pathname = usePathname();

    // Split the pathname into segments and remove empty strings
    const segments = pathname.split('/').filter(segment => segment !== '');

    const getTitle = (path: string) => {
        switch (path) {
            case '':
                return 'Dashboard';
            case 'inventory':
                return 'Inventory';
            case 'notifications':
                return 'Notifications';
            case 'access-control':
                return 'Access Control';
            case 'surveillance':
                return 'Surveillance';
            case 'settings':
                return 'Settings';
            default:
                return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {segments.map((segment, index) => {
                        const path = `/${segments.slice(0, index + 1).join('/')}`;
                        const isLast = index === segments.length - 1;

                        return (
                            <React.Fragment key={path}>
                                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                    {isLast ? (
                                        <BreadcrumbPage>{getTitle(segment)}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={path}>
                                            {getTitle(segment)}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                            </React.Fragment>
                        )
                    }
                    )}
                    {segments.length === 0 && (
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            <BreadcrumbSeparator/>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    );
}

export default Header;