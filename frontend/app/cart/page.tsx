"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package, DollarSign, Sparkles, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
//import ThreeBackground from "../../components/ThreeBackground"
import AnimatedCard from "../../components/AnimatedCard"
import FloatingElements from "../../components/FloatingElements"
import GlowingButton from "../../components/GlowingButton"

interface CartItem {
  id: number
  name: string
  price: number
  unit: string
  quantity: number
  supplier_name: string
  min_quantity: number
  description: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in and is a vendor
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "vendor") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    loadCart()
  }, [router])

  useEffect(() => {
    if (!isLoading && containerRef.current && headerRef.current) {
      // Staggered entrance animation
      const tl = gsap.timeline()

      tl.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      ).fromTo(
        containerRef.current.children,
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      )
    }
  }, [isLoading])

  const loadCart = () => {
    // Mock cart data with enhanced descriptions
    const mockCart: CartItem[] = [
      {
        id: 1,
        name: "Fresh Tomatoes",
        description: "Premium organic red tomatoes, perfect for cooking and fresh consumption",
        price: 2.25,
        unit: "kg",
        quantity: 15,
        supplier_name: "Fresh Produce Co",
        min_quantity: 5,
      },
      {
        id: 2,
        name: "Ground Beef",
        description: "Premium quality ground beef, grass-fed and locally sourced",
        price: 8.5,
        unit: "kg",
        quantity: 5,
        supplier_name: "Meat & More",
        min_quantity: 2,
      },
      {
        id: 3,
        name: "Whole Milk",
        description: "Fresh whole milk from local farms, rich in nutrients and flavor",
        price: 3.0,
        unit: "liter",
        quantity: 20,
        supplier_name: "Dairy Delights",
        min_quantity: 10,
      },
    ]

    // Simulate loading delay for better UX
    setTimeout(() => {
      setCartItems(mockCart)
      setIsLoading(false)
    }, 1000)
  }

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    updateCart(updatedCart)

    // Animate quantity change
    const quantityElement = document.querySelector(`[data-quantity-id="${id}"]`)
    if (quantityElement) {
      gsap.fromTo(
        quantityElement,
        { scale: 1.3, color: "#f97316" },
        { scale: 1, color: "#374151", duration: 0.3, ease: "back.out(1.7)" },
      )
    }
  }

  const removeItem = (id: number) => {
    const itemElement = document.querySelector(`[data-item-id="${id}"]`)
    if (itemElement) {
      gsap.to(itemElement, {
        x: -100,
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          const updatedCart = cartItems.filter((item) => item.id !== id)
          updateCart(updatedCart)
        },
      })
    }
  }

  const clearCart = () => {
    const items = document.querySelectorAll("[data-item-id]")
    gsap.to(items, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.in",
      onComplete: () => updateCart([]),
    })
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    // Checkout animation
    const checkoutBtn = document.querySelector(".checkout-btn")
    if (checkoutBtn) {
      gsap.to(checkoutBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id,
          totalPrice: getTotalPrice(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Success animation
        gsap.to(containerRef.current, {
          scale: 0.9,
          opacity: 0.5,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            clearCart()
            router.push("/vendor?tab=orders")
          },
        })
      } else {
        alert("Checkout failed. Please try again.")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleBackToDashboard = () => {
    gsap.to(containerRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push("/vendor"),
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        
        <FloatingElements />

        <AnimatedCard direction="scale" trigger="immediate" className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 animate-spin">
                <div className="absolute inset-2 rounded-full bg-white"></div>
              </div>
              <ShoppingCart className="absolute inset-0 m-auto w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Cart</h3>
            <p className="text-gray-600 font-medium">Preparing your amazing deals...</p>
            <div className="flex justify-center mt-4 space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 relative overflow-hidden">
      
      <FloatingElements />

      {/* Animated Header */}
      <div
        ref={headerRef}
        className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 p-4 mb-6 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GlowingButton onClick={handleBackToDashboard} variant="secondary" size="sm" className="!p-2 !rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </GlowingButton>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <h1 className="text-2xl font-bold text-gray-800">
                  Bulk<span className="text-orange-500">Bite</span>
                </h1>
                <Sparkles className="absolute -top-1 -right-6 w-4 h-4 text-orange-400 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-gray-600">Welcome back,</span>
              <p className="font-bold text-gray-800">{user?.name}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Enhanced Page Header */}
        <AnimatedCard direction="up" delay={0.2} className="relative">
          <div className="glass-card p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-orange-600 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                    Shopping Cart
                  </h1>
                  <p className="text-gray-600 font-medium text-lg">Review your amazing deals before checkout</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {getTotalItems()} items
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      Save $12.50
                    </span>
                  </div>
                </div>
              </div>
              <GlowingButton
                onClick={() => router.push("/products")}
                variant="accent"
                className="flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Continue Shopping</span>
              </GlowingButton>
            </div>
          </div>
        </AnimatedCard>

        {cartItems.length === 0 ? (
          /* Enhanced Empty Cart */
          <AnimatedCard direction="scale" delay={0.4}>
            <div className="glass-card p-16 text-center border border-white/20 shadow-2xl">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-purple-400 opacity-20 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-600 mb-4">Your cart feels lonely</h3>
              <p className="text-gray-500 mb-8 text-lg">
                Add some delicious products to start your group buying journey
              </p>
              <GlowingButton onClick={() => router.push("/products")} size="lg" className="shadow-2xl">
                <Package className="w-5 h-5 mr-2" />
                Explore Products
              </GlowingButton>
            </div>
          </AnimatedCard>
        ) : (
          /* Enhanced Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <AnimatedCard key={item.id} direction="left" delay={index * 0.1} trigger="scroll">
                  <div
                    data-item-id={item.id}
                    className="neuro-card p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 group relative overflow-hidden"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex items-start space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Package className="w-10 h-10 text-orange-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 mb-3 leading-relaxed">{item.description}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                            <DollarSign className="w-3 h-3 mr-1" />${item.price}/{item.unit}
                          </span>
                          <span className="bg-blue-100 px-3 py-1 rounded-full">by {item.supplier_name}</span>
                          <span className="bg-purple-100 px-3 py-1 rounded-full">
                            Min: {item.min_quantity} {item.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold text-gray-600">Quantity:</span>
                            <div className="flex items-center space-x-3 bg-white rounded-xl p-2 shadow-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span
                                data-quantity-id={item.id}
                                className="w-16 text-center font-bold text-2xl text-gray-800"
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Enhanced Price Display */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Total Price</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}

              {/* Enhanced Clear Cart */}
              <AnimatedCard direction="up" delay={0.5}>
                <div className="text-center">
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 px-6 py-3 rounded-lg hover:bg-red-50"
                  >
                    🗑️ Clear Entire Cart
                  </button>
                </div>
              </AnimatedCard>
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedCard direction="right" delay={0.3}>
                <div className="glass-card p-8 sticky top-32 border border-white/20 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💰</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <span className="text-gray-600 font-medium">Items ({getTotalItems()})</span>
                      <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <span className="text-gray-600 font-medium flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                        Group Discount
                      </span>
                      <span className="font-bold text-green-600 text-lg">-$12.50</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                      <span className="text-gray-600 font-medium flex items-center">
                        <Package className="w-4 h-4 mr-2 text-orange-500" />
                        Delivery
                      </span>
                      <span className="font-bold text-green-600 text-lg">Free</span>
                    </div>
                    <div className="border-t-2 border-gradient-to-r from-orange-200 to-purple-200 pt-6">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-purple-100 rounded-xl">
                        <span className="text-xl font-bold text-gray-800">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                          ${(getTotalPrice() - 12.5).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <GlowingButton
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full checkout-btn mb-6 shadow-2xl"
                    glowIntensity={1.5}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </GlowingButton>

                  <div className="neuro-card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Group Buying Benefits
                    </h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        Save $12.50 with bulk pricing
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        Free delivery on group orders
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        Quality guaranteed by suppliers
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
                    🔒 Secure checkout • By proceeding, you agree to our terms and conditions
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
