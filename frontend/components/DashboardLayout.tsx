"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { BarChart3, Users, Package, Star, LogOut, Menu, X, ShoppingCart, Store, Search } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "vendor" | "supplier"
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardLayout({ children, userType, activeTab, onTabChange }: DashboardLayoutProps) {
  const [user, setUser] = useState<any | null>(null)
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
    if (tab === "account") {
      // Navigate to standalone account page
      router.push("/account")
      return
    }

    // Animate content transition for other tabs
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
        localStorage.removeItem("cart")
        router.push("/")
      },
    })
  }

  const handleBrowseProducts = () => {
    router.push("/products")
  }

  const vendorTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "orange" },
    { id: "groups", label: "Groups", icon: Users, color: "blue" },
    { id: "orders", label: "Orders", icon: Package, color: "purple" },
    { id: "suppliers", label: "Suppliers", icon: Store, color: "green" },
    { id: "account", label: "Account", icon: Search, color: "gray" },
  ]

  const supplierTabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "orange" },
    { id: "products", label: "Products", icon: Package, color: "blue" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "purple" },
    { id: "reviews", label: "Reviews", icon: Star, color: "amber" },
    { id: "account", label: "Account", icon: Search, color: "gray" },
  ]

  const tabs = userType === "vendor" ? vendorTabs : supplierTabs

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-gray-50">
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
        <div className="bg-white shadow-lg h-full m-4 mr-0 lg:mr-4 rounded-r-none lg:rounded-r-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Bulk<span className="text-orange-500">Bite</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-medium">{user.name}</p>
                <div className="flex items-center mt-2">
                  {userType === "vendor" ? (
                    <Store className="w-4 h-4 text-orange-500 mr-2" />
                  ) : (
                    <Package className="w-4 h-4 text-orange-500 mr-2" />
                  )}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      userType === "vendor" ? "bg-orange-100 text-orange-800" : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {userType === "vendor" ? "Vendor" : "Supplier"}
                  </span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
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
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                )
              })}

              {/* Browse Products Button (for vendors) */}
              {userType === "vendor" && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={handleBrowseProducts}
                    className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold">Browse Products</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-all duration-300 rounded-xl font-semibold flex items-center space-x-2"
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
        <div className="lg:hidden bg-white shadow-sm m-4 mb-0 p-4 rounded-b-none">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Bulk<span className="text-orange-500">Bite</span>
            </h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Glassmorphism Navigation Bar */}
        <div className="sticky top-0 z-30 mb-6">
          <div className="glass-card p-4 mx-4 lg:mx-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    {userType === "vendor" ? (
                      <Store className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Package className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
                    <p className="text-xs text-gray-600 capitalize">{userType} Dashboard</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {userType === "vendor" && (
                  <button
                    onClick={() => router.push("/cart")}
                    className="relative p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                )}

                <button
                  onClick={() => router.push("/account")}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                  </div>
                </button>

                {userType === "supplier" && (
                  <button
                    onClick={() => router.push("/requirements")}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    Required Items
                  </button>
                )}
              </div>
            </div>
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
