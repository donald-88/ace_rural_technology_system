"use client"

import { usePathname } from 'next/navigation';
import { Bell, ChevronRight } from 'lucide-react';

const Header = () => {
    const pathname = usePathname();

    const getTitle = (path: string) => {
        switch(path) {
            case '/':
                return 'Dashboard';
            case '/inventory':
                return 'Inventory';
            case '/tasks':
                return 'Tasks';
            case '/team':
                return 'Team';
            default:
                return 'App Name'; // Default title
        }
    }

    const title = getTitle(pathname);

    return (
        <header className='h-[60px] w-full border-b border-gray-200'>
            <div className="flex justify-between items-center h-full px-4">
                <h2 className="flex items-center gap-0.5">{title}<ChevronRight size={20} strokeWidth={2}/></h2>
                <div className='flex items-center gap-2'>
                    <button className='bg-gray-100 p-2 rounded-full'>
                        <Bell size={20} color='#5D5F5D' />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header