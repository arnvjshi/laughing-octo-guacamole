"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

interface LoginData {
  email: string
  password: string
}

interface LoginErrors {
  [key: string]: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      router.push(user.type === "vendor" ? "/vendor" : "/supplier")
      return
    }

    // Animate page entrance
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push(data.user.type === "vendor" ? "/vendor" : "/supplier")
      } else {
        setErrors({ general: data.error || "Login failed" })
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div ref={containerRef} className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
              <p className="text-gray-600 mt-2">Welcome back to BulkBite</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/role-selection")}
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
