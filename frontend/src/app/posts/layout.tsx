'use client'

import { AppBar } from "@/components/app-bar"
import { PostsNav } from "@/components/posts-nav"
import { SidebarProvider } from "@/context/sidebar-context"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
        <div className={cn("min-h-screen", pathname === "/posts" || pathname === "/our-posts" ? "bg-[#BBC2C0]" : "bg-white")}>
            <AppBar />
            <div className="flex pt-16">
                <PostsNav />
                <main className="flex-1 p-6 md:ml-64 transition-all duration-300 ease-in-out">
                {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  )
}

