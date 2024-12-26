"use client"

import { useAuth } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { useSidebar } from "@/context/sidebar-context"

export function AppBar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()

  return (
    <header className="h-16 bg-[#243831] px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
      <div className="font-serif italic text-xl text-white">a Board</div>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${user.id}`} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-inherit" 
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}

