"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Store, Package, ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<"vendor" | "supplier" | null>(null)
  const router = useRouter()
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

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/signup?role=${selectedRole}`)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div ref={containerRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-orange-500">BulkBite</span>
            </h1>
            <p className="text-gray-600">Choose your role to get started with group buying</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Vendor Card */}
            <div
              onClick={() => setSelectedRole("vendor")}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === "vendor"
                  ? "border-orange-500 bg-orange-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Street Food Vendor</h3>
                <p className="text-gray-600">Join groups with other vendors to place bulk orders and reduce costs</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Form buying groups with nearby vendors
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Access bulk pricing from suppliers
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Split costs and boost profit margins
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Track orders and manage inventory
                </li>
              </ul>
            </div>

            {/* Supplier Card */}
            <div
              onClick={() => setSelectedRole("supplier")}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === "supplier"
                  ? "border-orange-500 bg-orange-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Supplier</h3>
                <p className="text-gray-600">Connect with vendor groups and fulfill bulk orders efficiently</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Receive bulk orders from vendor groups
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Manage inventory and pricing
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Build relationships with local vendors
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  Track deliveries and payments
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedRole
                  ? "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue as {selectedRole ? (selectedRole === "vendor" ? "Vendor" : "Supplier") : "..."}
            </button>

            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
