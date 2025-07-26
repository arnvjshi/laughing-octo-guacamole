"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"

export default function LoginPage() {
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial setup
    gsap.set([containerRef.current, cardRef.current, titleRef.current], { opacity: 0 })

    // Entrance animation
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .fromTo(
        cardRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" },
      )
      .fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5",
      )

    // Floating animation for background elements
    gsap.to(".floating-bg", {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5,
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Loading animation
    gsap.to(cardRef.current, { scale: 0.98, duration: 0.1 })

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_type: userType }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))

        // Success animation
        gsap.to(cardRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 0.9,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                router.push(userType === "vendor" ? "/vendor" : "/supplier")
              },
            })
          },
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      gsap.to(cardRef.current, { scale: 1, duration: 0.2 })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeChange = (type: "vendor" | "supplier") => {
    gsap.to(".user-type-indicator", {
      scale: 0.9,
      duration: 0.1,
      onComplete: () => {
        setUserType(type)
        gsap.to(".user-type-indicator", { scale: 1, duration: 0.2, ease: "back.out(1.7)" })
      },
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-bg absolute top-20 left-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"></div>
        <div className="floating-bg absolute top-40 right-20 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl"></div>
        <div className="floating-bg absolute bottom-32 left-1/4 w-40 h-40 bg-amber-200/30 rounded-full blur-xl"></div>
        <div className="floating-bg absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-300/30 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div ref={cardRef} className="glass-card p-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full pulse-glow"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full pulse-glow"></div>

          <div className="text-center mb-8">
            <h1
              ref={titleRef}
              className="text-4xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-3"
            >
              BulkBite
            </h1>
            <p className="text-gray-600 font-medium">Smart Group Buying Platform</p>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full mx-auto mt-3"></div>
          </div>

          {/* User Type Selector */}
          <div className="user-type-indicator mb-8">
            <div className="neuro-card p-2 flex rounded-2xl">
              <button
                type="button"
                onClick={() => handleUserTypeChange("vendor")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  userType === "vendor"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-white/50"
                }`}
              >
                🏪 Vendor
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange("supplier")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  userType === "supplier"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-white/50"
                }`}
              >
                🚚 Supplier
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                userType === "vendor"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                `Sign In as ${userType === "vendor" ? "Vendor" : "Supplier"}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Join the future of group buying for street vendors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
