"use client"

import {
  ChevronsUpDown,
  Home,
  LogOut,
  Package,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { getInitials } from "@/lib/utils"
import { Session } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function NavUser({ session }: { session: Session | null }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const isAdmin = pathname.includes("/warehouse")

  const user = session?.user

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin")
          }
        }
      })
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Please try again later.",
      })
    }
  }

  return (
    <SidebarMenu className="mb-4 border-muted-200 border rounded-lg p-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage src={user?.image as string} alt={user?.name as string} />
                <AvatarFallback className=" bg-primary-foreground text-primary">{getInitials(user?.name as string)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage src={user?.image as string} alt={user?.name as string} />
                  <AvatarFallback className="bg-primary-foreground text-primary">{getInitials(user?.name as string)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {
              user?.role === "admin" ? (
                <div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Quick Access
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    {
                      isAdmin ? (
                        <Link href="/" className="flex gap-2 items-center">
                          <Home />
                          Dashboard
                        </Link>
                      ) : (
                        <Link href="/warehouse/receipts" className="flex gap-2 items-center">
                          <Package />
                          Warehouse
                        </Link>
                      )
                    }
                  </DropdownMenuItem>
                </div>
              ) : (
                <></>
              )
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form action={handleSignOut}>
                <button className="flex gap-2 items-center">
                  <LogOut />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
