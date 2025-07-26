"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Package, TrendingUp, DollarSign, Star, Users, Calendar, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "../../components/DashboardLayout"

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  min_quantity: number
  supplier_id: number
}

interface Order {
  id: number
  quantity: number
  total_price: number
  status: string
  group_name: string
  vendor_name: string
  created_at: string
}

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const statsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!isLoading && activeTab === "dashboard") {
      // Animate stats cards
      gsap.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        },
      )
    }
  }, [isLoading, activeTab])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([fetch("/api/products"), fetch("/api/orders")])

      const [productsData, ordersData] = await Promise.all([productsRes.json(), ordersRes.json()])

      setProducts(productsData)
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Package className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
            Supplier Dashboard
          </h1>
        </div>
        <p className="text-gray-600 font-medium">Manage your products and fulfill orders efficiently.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          ref={(el) => el && (statsRef.current[0] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Products</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{products.length}</p>
            </div>
            <Package className="w-10 h-10 text-emerald-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+5</span>
            <span className="text-gray-500 ml-1">new this month</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[1] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Orders</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {orders.filter((o) => o.status !== "delivered").length}
              </p>
            </div>
            <Users className="w-10 h-10 text-indigo-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+18%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[2] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">$8,450</p>
            </div>
            <DollarSign className="w-10 h-10 text-amber-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+32%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[3] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Customer Rating</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">4.8</p>
            </div>
            <Star className="w-10 h-10 text-emerald-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+0.2</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold font-poppins text-gray-800">Recent Orders</h3>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="neuro-card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{order.group_name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      order.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  From: {order.vendor_name}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{order.quantity} units</span>
                  <span className="text-lg font-bold text-emerald-600">${order.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold font-poppins text-gray-800">Top Products</h3>
          </div>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="neuro-card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <span className="text-lg font-bold text-emerald-600">
                    ${product.price}/{product.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="w-4 h-4 mr-1" />
                  Min: {product.min_quantity} {product.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              My Products
            </h2>
          </div>
          <button className="neuro-button px-6 py-3 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="neuro-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
              </div>

              <p className="text-gray-600 mb-4 text-center">{product.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Price:
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${product.price}/{product.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Min Quantity:
                  </span>
                  <span className="text-sm font-semibold">
                    {product.min_quantity} {product.unit}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 neuro-button py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="flex-1 neuro-button py-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Users className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
            Incoming Orders
          </h2>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="neuro-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{order.group_name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Users className="w-4 h-4 mr-1" />
                    Vendor: {order.vendor_name}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Quantity:
                      </span>
                      <p className="font-semibold">{order.quantity} units</p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Total:
                      </span>
                      <p className="font-bold text-emerald-600">${order.total_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Status:
                      </span>
                      <p
                        className={`font-semibold ${
                          order.status === "pending"
                            ? "text-amber-600"
                            : order.status === "confirmed"
                              ? "text-blue-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date:
                      </span>
                      <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  {order.status === "pending" && (
                    <>
                      <button className="neuro-button px-4 py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                        Accept
                      </button>
                      <button className="neuro-button px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors duration-200">
                        Decline
                      </button>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <button className="neuro-button px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Star className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
            Customer Reviews
          </h2>
        </div>

        <div className="space-y-4">
          <div className="neuro-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Street Food Corner</h4>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Excellent quality products! Always fresh and reliable. The delivery was on time and the packaging was
              perfect. Highly recommend!"
            </p>
          </div>

          <div className="neuro-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Quick Bites</h4>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
              <div className="flex">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Good service and fast delivery. The products were as described. Will definitely order again for our next
              group buy."
            </p>
          </div>

          <div className="neuro-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Local Eats</h4>
                  <p className="text-sm text-gray-600">2 weeks ago</p>
                </div>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Outstanding supplier! Great prices, excellent quality, and fantastic customer service. They really
              understand the needs of street vendors."
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="neuro-card p-6 inline-block">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Rating</h3>
            <div className="flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-emerald-600 mr-2">4.8</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">Based on 47 reviews</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "products":
        return renderProducts()
      case "orders":
        return renderOrders()
      case "reviews":
        return renderReviews()
      default:
        return renderDashboard()
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout userType="supplier" activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="supplier" activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}
