"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Users, Package, DollarSign, Calendar, Clock, ArrowLeft, Plus, Target } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  min_quantity: number
  supplier_name: string
}

export default function CreateGroupPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_quantity: "",
    price_per_unit: "",
    deadline_days: "3",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")

  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    if (productId) {
      fetchProduct()
    } else {
      setIsLoading(false)
    }
  }, [router, productId])

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      // Animate container entrance
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })

      // Animate form elements
      gsap.fromTo(
        formRef.current?.children || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
      )
    }
  }, [isLoading])

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/products")
      const products = await response.json()
      const selectedProduct = products.find((p: Product) => p.id === Number.parseInt(productId!))

      if (selectedProduct) {
        setProduct(selectedProduct)
        // Pre-fill form with product data
        setFormData((prev) => ({
          ...prev,
          name: `${selectedProduct.name} Group Buy`,
          description: `Group purchase for ${selectedProduct.name} - ${selectedProduct.description}`,
          price_per_unit: (selectedProduct.price * 0.9).toFixed(2), // 10% discount for group buy
        }))
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Animate form submission
    gsap.to(formRef.current, { scale: 0.98, duration: 0.1 })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success animation
      gsap.to(formRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              router.push("/vendor?tab=groups")
            },
          })
        },
      })
    } catch (error) {
      console.error("Error creating group:", error)
      gsap.to(formRef.current, { scale: 1, duration: 0.2 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                  Create Group Buy
                </h1>
                <p className="text-gray-600 font-medium">Start a new group buying opportunity</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="neuro-button px-6 py-3 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Product Info (if selected) */}
          {product && (
            <div className="neuro-card p-4 bg-gradient-to-r from-indigo-50 to-emerald-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-emerald-600 font-semibold">
                      Original: ${product.price}/{product.unit}
                    </span>
                    <span className="text-indigo-600 font-semibold">Supplier: {product.supplier_name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your group buy..."
                rows={4}
                className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500 resize-none"
                required
              />
            </div>

            {/* Target Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Target Quantity *
                </label>
                <input
                  type="number"
                  name="target_quantity"
                  value={formData.target_quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  min="1"
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price per Unit *
                </label>
                <input
                  type="number"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.25"
                  step="0.01"
                  min="0.01"
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Deadline *
              </label>
              <select
                name="deadline_days"
                value={formData.deadline_days}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 appearance-none"
                required
              >
                <option value="1">1 day from now</option>
                <option value="2">2 days from now</option>
                <option value="3">3 days from now</option>
                <option value="5">5 days from now</option>
                <option value="7">1 week from now</option>
                <option value="14">2 weeks from now</option>
              </select>
            </div>

            {/* Benefits Section */}
            <div className="neuro-card p-6 bg-gradient-to-r from-emerald-50 to-indigo-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-emerald-600" />
                Group Buy Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Better pricing through bulk orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Share costs with other vendors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Guaranteed minimum quantities</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 neuro-button py-4 font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 hover:shadow-lg hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Group...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Create Group Buy</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="glass-card p-6 mt-8">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-600" />
            Tips for Successful Group Buys
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p>• Set realistic target quantities based on demand</p>
              <p>• Price competitively to attract more participants</p>
              <p>• Provide clear product descriptions</p>
            </div>
            <div className="space-y-2">
              <p>• Allow sufficient time for others to join</p>
              <p>• Communicate with participants regularly</p>
              <p>• Coordinate delivery logistics in advance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
