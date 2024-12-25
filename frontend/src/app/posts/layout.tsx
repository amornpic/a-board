import { AppBar } from "@/components/app-bar"
import { PostsNav } from "@/components/posts-nav"
import { SidebarProvider } from "@/context/sidebar-context"

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <div className="min-h-screen bg-[#BBC2C0]">
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

