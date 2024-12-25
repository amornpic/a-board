"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AuthState } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (username: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const dataUser = localStorage.getItem('user')
        
        if (dataUser) {
          setAuthState({ user: JSON.parse(dataUser), isLoading: false })
        } else {
          setAuthState({ user: null, isLoading: false })
        }
      } catch {
        setAuthState({ user: null, isLoading: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string) => {
    setAuthState({ ...authState, isLoading: true })
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) throw new Error('Login failed')

      const user = await response.json()
      setAuthState({ user, isLoading: false })
      localStorage.setItem('user', JSON.stringify(user))
      
      // Set auth cookie
      document.cookie = `auth=true; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
      
    } catch (error) {
      setAuthState({ user: null, isLoading: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('user')
      setAuthState({ user: null, isLoading: false })
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider> 
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

