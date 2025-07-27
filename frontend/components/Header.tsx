"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface User {
  id: number
  name: string
  email: string
  type: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(updatedCart.length)
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleGetStarted = () => {
    router.push("/role-selection")
  }

  const handleDashboard = () => {
    if (user) {
      router.push(user.type === "vendor" ? "/vendor" : "/supplier")
    }
  }

  const handleCart = () => {
    router.push("/cart")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    setUser(null)
    setCartCount(0)
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Bulk<span className="text-orange-500">Bite</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
              About Us
            </Link>
            {user && user.type === "vendor" && (
              <Link href="/products" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                Products
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.type === "vendor" && (
                  <button
                    onClick={handleCart}
                    className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleDashboard}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              {user && user.type === "vendor" && (
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              )}

              {user ? (
                <>
                  {user.type === "vendor" && (
                    <button
                      onClick={() => {
                        handleCart()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDashboard()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-red-500 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-orange-500 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleGetStarted()
                      setIsMenuOpen(false)
                    }}
                    className="text-left bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 w-fit"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
