import "./globals.css";
import { Inter } from 'next/font/google'
import { AuthProvider } from "@/context/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "a Board",
  description: "A platform for sharing thoughts and ideas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

