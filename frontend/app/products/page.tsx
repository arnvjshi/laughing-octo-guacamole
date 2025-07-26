"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Package, Search, Filter, DollarSign, Users, Star, ShoppingCart, Store } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  min_quantity: number
  supplier_id: number
  supplier_name: string
}

interface Supplier {
  id: number
  name: string
  rating: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    fetchData()
  }, [router])

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      // Animate container entrance
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })

      // Animate product cards
      gsap.fromTo(
        productsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
      )
    }
  }, [isLoading, filteredProducts])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedSupplier, priceRange, sortBy])

  const fetchData = async () => {
    try {
      const [productsRes, suppliersRes] = await Promise.all([fetch("/api/products"), fetch("/api/suppliers")])

      const [productsData, suppliersData] = await Promise.all([productsRes.json(), suppliersRes.json()])

      setProducts(productsData)
      setSuppliers(suppliersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Supplier filter
    if (selectedSupplier !== "all") {
      filtered = filtered.filter((product) => product.supplier_id === Number.parseInt(selectedSupplier))
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "supplier":
          return a.supplier_name.localeCompare(b.supplier_name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    // Animate button click
    const button = event?.target as HTMLElement
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })

    // Here you would typically add to cart logic
    console.log("Added to cart:", product)
  }

  const getSupplierRating = (supplierId: number) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    return supplier?.rating || 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div ref={containerRef} className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                  All Products
                </h1>
                <p className="text-gray-600 font-medium">Browse products from all suppliers</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="neuro-button px-6 py-3 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 placeholder-gray-500"
              />
            </div>

            {/* Supplier Filter */}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Prices</option>
                <option value="0-5">$0 - $5</option>
                <option value="5-10">$5 - $10</option>
                <option value="10-20">$10 - $20</option>
                <option value="20">$20+</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 appearance-none"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="supplier">Sort by Supplier</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{suppliers.length} suppliers available</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => el && (productsRef.current[index] = el)}
                className="neuro-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Product Header */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>

                {/* Supplier Info */}
                <div className="mb-4 p-3 bg-gray-50/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{product.supplier_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < getSupplierRating(product.supplier_id) ? "text-amber-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({getSupplierRating(product.supplier_id)})</span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Price:
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      ${product.price}/{product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      Min Order:
                    </span>
                    <span className="text-sm font-semibold">
                      {product.min_quantity} {product.unit}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full neuro-button py-3 font-semibold text-indigo-600 hover:text-indigo-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => router.push(`/groups/create?productId=${product.id}`)}
                    className="w-full neuro-button py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Join Group Buy</span>
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <div className="glass-card p-6 inline-block">
              <p className="text-gray-600 mb-4">Showing all {filteredProducts.length} products</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>{products.length} total products</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Store className="w-4 h-4" />
                  <span>{suppliers.length} suppliers</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
