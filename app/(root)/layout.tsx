import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <main className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Layout