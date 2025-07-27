"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Store, Package, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

interface FormData {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  businessName: string
  address: string
  foodType?: string
  primaryLocation?: string
  description: string
}

interface FormErrors {
  [key: string]: string
}

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") as "vendor" | "supplier" | null

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    address: "",
    foodType: "",
    primaryLocation: "",
    description: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!role) {
      router.push("/role-selection")
      return
    }

    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      router.push(user.type === "vendor" ? "/vendor" : "/supplier")
      return
    }

    // Animate page entrance
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
  }, [role, router])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    if (role === "vendor") {
      if (!formData.foodType?.trim()) newErrors.foodType = "Food type is required"
      if (!formData.primaryLocation?.trim()) newErrors.primaryLocation = "Primary location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType: role }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push(role === "vendor" ? "/vendor" : "/supplier")
      } else {
        setErrors({ general: data.error || "Sign up failed" })
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (!role) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div ref={containerRef} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {role === "vendor" ? (
                  <Store className="w-8 h-8 text-orange-500" />
                ) : (
                  <Package className="w-8 h-8 text-orange-500" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sign up as {role === "vendor" ? "Vendor" : "Supplier"}
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.fullName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

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

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 ${
                        errors.confirmPassword ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.businessName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your business name"
                />
                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your business address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Vendor-specific fields */}
              {role === "vendor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                    <input
                      type="text"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.foodType ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="e.g., Street snacks, Beverages"
                    />
                    {errors.foodType && <p className="text-red-500 text-sm mt-1">{errors.foodType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Location</label>
                    <input
                      type="text"
                      name="primaryLocation"
                      value={formData.primaryLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.primaryLocation ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="e.g., Market Street, Business District"
                    />
                    {errors.primaryLocation && <p className="text-red-500 text-sm mt-1">{errors.primaryLocation}</p>}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder={
                    role === "vendor" ? "Tell us about your food business..." : "Tell us about your supply business..."
                  }
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    Sign In
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
