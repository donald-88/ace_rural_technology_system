import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Define the type for a menu item
interface MenuItemProps {
    link: {
        name: string;
        path: string;
        icon: React.ReactNode;
        subMenu?: boolean;
        subMenuItems?: Array<{
            name: string;
            path: string;
        }>;
    };
}

const MenuItem: React.FC<MenuItemProps> = ({ link }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isActive = pathname === link.path;

    const toggleSubmenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (link.subMenu) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <li key={link.path}>
            <Link
                href={link.path}
                className={cn(
                    "flex items-center justify-between p-3.5 rounded-lg cursor-pointer text-sm text-secondary",
                    isActive && "bg-primary-foreground text-sm text-primary font-normal"
                )}
                onClick={toggleSubmenu}
            >
                <div className="flex gap-2.5">
                    {link.icon}
                    <p>{link.name}</p>
                </div>
                {link.subMenu && (
                    isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
            </Link>
            {link.subMenu && isOpen && link.subMenuItems && (
                <ul className="ml-6 mb-2">
                    {link.subMenuItems.map((subItem) => (
                        <li key={subItem.name}>
                            <Link
                                href={subItem.path}
                                className={cn(
                                    "flex py-2 px-3.5 rounded-lg cursor-pointer text-sm text-secondary",
                                    pathname === subItem.path && "bg-primary bg-opacity-15 text-sm text-primary"
                                )}
                            >
                                {subItem.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default MenuItem;