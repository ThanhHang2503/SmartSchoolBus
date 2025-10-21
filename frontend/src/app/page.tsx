

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"

const RADIUS = 240
const BAR_COUNT = 66
const BAR_LENGTH = 17
const BAR_WIDTH = 4

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [lightIndex, setLightIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  useEffect(() => {
    const animate = () => {
      setLightIndex((prev) => (prev + 1) % BAR_COUNT)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.fillStyle = "#f0f8ff"
    ctx.fillRect(0, 0, width, height)

    // Draw header
    ctx.fillStyle = "#d4e8ff"
    ctx.fillRect(0, 0, width, 80)
    ctx.fillStyle = "#2d4f7f"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("SMART SCHOOL BUS", centerX, 40)

    // Draw animated light bars
    for (let i = 0; i < BAR_COUNT; i++) {
      const angleDeg = (i * 360) / BAR_COUNT
      const angleRad = (angleDeg * Math.PI) / 180

      const x0 = centerX + (RADIUS - BAR_LENGTH) * Math.cos(angleRad)
      const y0 = centerY + (RADIUS - BAR_LENGTH) * Math.sin(angleRad)
      const x1 = centerX + (RADIUS + BAR_LENGTH) * Math.cos(angleRad)
      const y1 = centerY + (RADIUS + BAR_LENGTH) * Math.sin(angleRad)

      const distance = Math.min(Math.abs(i - lightIndex), BAR_COUNT - Math.abs(i - lightIndex))

      let color: string
      if (distance < 5) {
        color = "#7eb3d4" // Blue pastel đậm
      } else if (distance < 10) {
        color = "#9dc4d8" // Blue pastel vừa
      } else if (distance < 15) {
        color = "#b8d4e8" // Blue pastel nhạt
      } else {
        color = "#d4e8ff" // Blue pastel rất nhạt
      }

      ctx.strokeStyle = color
      ctx.lineWidth = BAR_WIDTH
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.stroke()
    }
  }, [lightIndex])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f0f8ff]">
      {/* Canvas for animated bars */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#2d4f7f] mb-2">Đăng nhập</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-80">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Tên đăng nhập"
                className="w-full px-4 py-3 rounded-lg bg-white text-[#2d4f7f] placeholder-[#9dc4d8] border-2 border-[#b8d4e8] focus:outline-none focus:border-[#7eb3d4] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                placeholder="Mật khẩu"
                className="w-full px-4 py-3 rounded-lg bg-white text-[#2d4f7f] placeholder-[#9dc4d8] border-2 border-[#b8d4e8] focus:outline-none focus:border-[#7eb3d4] transition-colors"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[#7eb3d4] hover:bg-[#6a9fc0] text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
