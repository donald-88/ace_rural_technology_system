"use client"

import { settingsLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const SettingsTab = () => {

    const pathname = usePathname()

    return (
        <nav className='flex gap-4 border-b mb-4'>
            {
                settingsLinks.map((link) => {
                    const isActive = pathname === link.path || pathname.startsWith(link.path)
                    return (
                        <div>
                            <Link key={link.name} href={link.path} className={cn("text-secondary", isActive && "text-primary font-medium")}>{link.name}</Link>
                            <div className='h-1' />
                            {
                                isActive && <hr className="border-primary border-[1px] rounded-sm" />
                            }
                        </div>
                    )
                })
            }
        </nav>
    )
}

export default SettingsTab