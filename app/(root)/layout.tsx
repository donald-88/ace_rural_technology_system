import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {

    const session = await auth.api.getSession({
            headers: await headers(),
        })
    return (
        <SidebarProvider>
            <AppSidebar session={session}/>
            <SidebarInset className="w-full">
                <Header />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout