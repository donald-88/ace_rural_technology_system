"use client"

import { usePathname } from 'next/navigation';
import { Input } from './ui/input';
import { Bell } from 'lucide-react';

const Header = () => {

    const pathname = usePathname();


    return (
        <header className='h-[60px] w-full border-b border-gray-200'>
            <div className="flex justify-between items-center h-full px-4">
                <h2></h2>
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