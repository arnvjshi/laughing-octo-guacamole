"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { BarChart3, Users, Package, Star, LogOut, Menu, X, ShoppingCart, Store, Search } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  type: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "vendor" | "supplier"
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardLayout({ children, userType, activeTab, onTabChange }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const sidebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
      return
    }

    // Entrance animation
    const tl = gsap.timeline()
    tl.fromTo(
      sidebarRef.current,
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    ).fromTo(
      contentRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4",
    )
  }, [router])

  const handleTabChange = (tab: string) => {
    // Animate content transition
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        onTabChange(tab)
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        })
      },
    })
  }

  const handleLogout = () => {
    gsap.to([sidebarRef.current, contentRef.current], {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        localStorage.removeItem("user")
        router.push("/")
      },
    })
  }

  const handleBrowseProducts = () => {
    router.push("/products")
  }

  const vendorTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "indigo" },
    { id: "groups", label: "Groups", icon: Users, color: "blue" },
    { id: "orders", label: "Orders", icon: Package, color: "purple" },
    { id: "suppliers", label: "Suppliers", icon: Store, color: "emerald" },
  ]

  const supplierTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "emerald" },
    { id: "products", label: "Products", icon: Package, color: "blue" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "purple" },
    { id: "requirements", label: "Required Items", icon: Search, color: "amber" },
    { id: "reviews", label: "Reviews", icon: Star, color: "amber" },
  ]

  const tabs = userType === "vendor" ? vendorTabs : supplierTabs

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block w-80 h-screen`}
      >
        <div className="glass-card h-full m-4 mr-0 lg:mr-4 rounded-r-none lg:rounded-r-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                  BulkBite
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-medium">{user.name}</p>
                <div className="flex items-center mt-2">
                  {userType === "vendor" ? (
                    <Store className="w-4 h-4 text-indigo-600 mr-2" />
                  ) : (
                    <Package className="w-4 h-4 text-emerald-600 mr-2" />
                  )}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      userType === "vendor" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {userType === "vendor" ? "Vendor" : "Supplier"}
                  </span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden neuro-button p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-1">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${
                            userType === "vendor" ? "from-indigo-500 to-indigo-600" : "from-emerald-500 to-emerald-600"
                          } text-white shadow-lg`
                        : "text-gray-600 hover:bg-white/30 neuro-button"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                )
              })}

              {/* Browse Products Button (for vendors) */}
              {userType === "vendor" && (
                <div className="pt-4 border-t border-white/20 mt-4">
                  <button
                    onClick={handleBrowseProducts}
                    className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group text-gray-600 hover:bg-white/30 neuro-button"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">Browse Products</span>
                  </button>
                </div>
              )}
              {userType === "supplier" && (
                <div className="pt-4 border-t border-white/20 mt-4">
                  <button
                    onClick={() => router.push("/requirements")}
                    className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group text-gray-600 hover:bg-white/30 neuro-button"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">Required Items</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full neuro-button px-4 py-3 text-gray-600 hover:text-red-600 transition-all duration-300 rounded-xl font-semibold flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden glass-card m-4 mb-0 p-4 rounded-b-none">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="neuro-button p-2 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              BulkBite
            </h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 p-4 lg:pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
