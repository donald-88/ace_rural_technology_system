"use client"

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

const Header = () => {
    const pathname = usePathname();

    const getTitle = (path: string) => {
        switch (path) {
            case '/':
                return 'Dashboard';
            case '/inventory':
                return 'Inventory';
            case '/notifications':
                return 'Notifications';
            case '/access-control':
                return 'Access Control';
            case '/surveillance':
                return 'Surveillance';
            case '/settings':
                return 'Settings';
            default:
                return 'App Name'; // Default title
        }
    }

    const title = getTitle(pathname);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            {getTitle(pathname)}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </header>
    )
}

export default Header