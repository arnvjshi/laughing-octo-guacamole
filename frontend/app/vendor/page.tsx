"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Users, Package, DollarSign, Star, TrendingUp, Calendar, MapPin, Phone } from "lucide-react"
import DashboardLayout from "../../components/DashboardLayout"
import { useRouter } from "next/navigation"

interface Group {
  id: number
  name: string
  description: string
  target_quantity: number
  current_quantity: number
  price_per_unit: number
  status: string
  product_name: string
  deadline: string
  product_id: string
}

interface Order {
  id: number
  quantity: number
  total_price: number
  status: string
  group_name: string
  created_at: string
}

interface Supplier {
  id: number
  name: string
  location: string
  rating: number
  description: string
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [groups, setGroups] = useState<Group[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const statsRef = useRef<HTMLDivElement[]>([])
  const router = useRouter()

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
      const [groupsRes, ordersRes, suppliersRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/orders"),
        fetch("/api/suppliers"),
      ])

      const [groupsData, ordersData, suppliersData] = await Promise.all([
        groupsRes.json(),
        ordersRes.json(),
        suppliersRes.json(),
      ])

      setGroups(groupsData)
      setOrders(ordersData)
      setSuppliers(suppliersData)
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
          <Users className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome back!
          </h1>
        </div>
        <p className="text-gray-600 font-medium">Here's what's happening with your group buying today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          ref={(el) => el && (statsRef.current[0] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Groups</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {groups.filter((g) => g.status === "active").length}
              </p>
            </div>
            <Users className="w-10 h-10 text-indigo-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+12%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[1] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Orders</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{orders.length}</p>
            </div>
            <Package className="w-10 h-10 text-emerald-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+8%</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[2] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Savings</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">$1,247</p>
            </div>
            <DollarSign className="w-10 h-10 text-amber-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+23%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div
          ref={(el) => el && (statsRef.current[3] = el)}
          className="neuro-card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Success Rate</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">94%</p>
            </div>
            <Star className="w-10 h-10 text-indigo-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-semibold">+2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Groups */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold font-poppins text-gray-800">Hot Groups</h3>
          </div>
          <div className="space-y-4">
            {groups.slice(0, 3).map((group, index) => (
              <div key={group.id} className="neuro-card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800">{group.name}</h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-semibold">
                    {group.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{group.product_name}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {group.current_quantity}/{group.target_quantity} units
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(group.current_quantity / group.target_quantity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-600">${group.price_per_unit}/unit</span>
                  <button className="neuro-button px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="w-6 h-6 text-emerald-600" />
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{order.quantity} units</span>
                  <span className="text-lg font-bold text-emerald-600">${order.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Available Groups
            </h2>
          </div>
          <button className="neuro-button px-6 py-3 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="neuro-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    group.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {group.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{group.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Product:
                  </span>
                  <span className="text-sm font-semibold">{group.product_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Progress:
                  </span>
                  <span className="text-sm font-semibold">
                    {group.current_quantity}/{group.target_quantity} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Price:
                  </span>
                  <span className="text-sm font-bold text-emerald-600">${group.price_per_unit}/unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Deadline:
                  </span>
                  <span className="text-sm font-semibold text-amber-600">
                    {new Date(group.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(group.current_quantity / group.target_quantity) * 100}%` }}
                ></div>
              </div>

              <button
                onClick={() => router.push(`/groups/create?productId=${group.product_id}`)}
                className="w-full neuro-button py-3 font-semibold text-indigo-600 hover:text-indigo-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Join Group</span>
              </button>
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
          <Package className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            My Orders
          </h2>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="neuro-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{order.group_name}</h3>
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
                <div className="ml-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSuppliers = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Package className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold font-poppins bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            Trusted Suppliers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="neuro-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{supplier.name}</h3>
                <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {supplier.location}
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < supplier.rating ? "text-amber-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({supplier.rating}/5)</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mb-4">{supplier.description}</p>

              <div className="flex space-x-2">
                <button className="flex-1 neuro-button py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </button>
                <button className="flex-1 neuro-button py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "groups":
        return renderGroups()
      case "orders":
        return renderOrders()
      case "suppliers":
        return renderSuppliers()
      default:
        return renderDashboard()
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout userType="vendor" activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="vendor" activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}
