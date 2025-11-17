"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/auth";


interface AuthContextType {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  user: User | null
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Load user từ localStorage khi reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:5000/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error(`Server trả về lỗi: ${res.status}`)

      const data = await res.json()
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/home")
      } else {
        alert(data.message || "Sai tài khoản hoặc mật khẩu!")
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err)
      alert(err.message || "Không thể kết nối tới server!")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isLoading, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
