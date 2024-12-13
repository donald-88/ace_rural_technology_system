import Header from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import WarehouseSidebar from "@/components/warehouse-sidebar"

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <SidebarProvider>
            <WarehouseSidebar />
            <SidebarInset className="w-full">
                <Header />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout