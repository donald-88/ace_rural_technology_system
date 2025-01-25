import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await auth()
    return (
        <SidebarProvider>
            <AppSidebar user={session?.user}/>
            <SidebarInset className="w-full">
                <Header/>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout