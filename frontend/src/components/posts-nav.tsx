'use client'

import Link from "next/link"
import { Home, BookOpen } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useSidebar } from "@/context/sidebar-context"

export function PostsNav() {
    const { isOpen } = useSidebar()

    return (
      <aside className={cn(
        "w-64 md:bg-[#BBC2C0] bg-[#243831] text-white md:text-black min-h-screen p-4 fixed top-16 bottom-0 transition-transform ease-in-out z-40",
        "md:left-0 md:translate-x-0",
        isOpen ? "right-0 translate-x-0" : "right-0 translate-x-full"
      )}>
        <nav className="space-y-2">
          <Link
            href="/posts"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/our-posts"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <BookOpen className="w-4 h-4" />
            Our Blog
          </Link>
        </nav>
      </aside>
    )
}

