import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="w-full">
                <Header/>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout