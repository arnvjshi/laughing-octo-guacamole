"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import {
  Search,
  Clock,
  MapPin,
  DollarSign,
  Package,
  User,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Send,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Requirement {
  id: number
  item_name: string
  description: string
  requested_by: string
  vendor_id: number
  quantity_needed: number
  unit: string
  max_price: number
  deadline: string
  location: string
  status: string
  urgency: string
  created_at: string
  contact_info: string
  additional_notes: string
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const requirementsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "supplier") {
      router.push("/")
      return
    }
    setUser(parsedUser)

    fetchRequirements()
  }, [router])

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      // Animate container entrance
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })

      // Animate requirement cards
      gsap.fromTo(
        requirementsRef.current,
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
  }, [isLoading, filteredRequirements])

  useEffect(() => {
    filterRequirements()
  }, [requirements, searchTerm, statusFilter, urgencyFilter])

  const fetchRequirements = async () => {
    try {
      const response = await fetch(`/api/requirements?status=${statusFilter}&urgency=${urgencyFilter}`)
      const data = await response.json()
      setRequirements(data)
    } catch (error) {
      console.error("Error fetching requirements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRequirements = () => {
    let filtered = [...requirements]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.requested_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRequirements(filtered)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-amber-600 bg-amber-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-600 bg-emerald-100"
      case "urgent":
        return "text-red-600 bg-red-100"
      case "fulfilled":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleRespond = (requirement: Requirement) => {
    setSelectedRequirement(requirement)
    setShowResponseModal(true)
  }

  const ResponseModal = () => {
    const [responseData, setResponseData] = useState({
      quoted_price: "",
      available_quantity: "",
      delivery_date: "",
      message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        const response = await fetch("/api/requirements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requirement_id: selectedRequirement?.id,
            supplier_id: user?.id,
            ...responseData,
          }),
        })

        if (response.ok) {
          setShowResponseModal(false)
          setSelectedRequirement(null)
          // Show success message
          alert("Response sent successfully!")
        }
      } catch (error) {
        console.error("Error submitting response:", error)
      } finally {
        setIsSubmitting(false)
      }
    }

    if (!showResponseModal || !selectedRequirement) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-poppins text-gray-800">Respond to Requirement</h3>
            <button
              onClick={() => setShowResponseModal(false)}
              className="neuro-button p-2 rounded-lg text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="neuro-card p-4 mb-6 bg-gradient-to-r from-indigo-50 to-emerald-50">
            <h4 className="font-bold text-gray-800 mb-2">{selectedRequirement.item_name}</h4>
            <p className="text-sm text-gray-600 mb-2">{selectedRequirement.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Requested by:</span>
                <p className="font-semibold">{selectedRequirement.requested_by}</p>
              </div>
              <div>
                <span className="text-gray-500">Quantity needed:</span>
                <p className="font-semibold">
                  {selectedRequirement.quantity_needed} {selectedRequirement.unit}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Max price:</span>
                <p className="font-semibold text-emerald-600">
                  ${selectedRequirement.max_price}/{selectedRequirement.unit}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Deadline:</span>
                <p className="font-semibold text-amber-600">
                  {new Date(selectedRequirement.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Price per {selectedRequirement.unit} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={responseData.quoted_price}
                  onChange={(e) => setResponseData({ ...responseData, quoted_price: e.target.value })}
                  placeholder={`Max: $${selectedRequirement.max_price}`}
                  className="w-full p-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Quantity *</label>
                <input
                  type="number"
                  value={responseData.available_quantity}
                  onChange={(e) => setResponseData({ ...responseData, available_quantity: e.target.value })}
                  placeholder={`Needed: ${selectedRequirement.quantity_needed} ${selectedRequirement.unit}`}
                  className="w-full p-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Date *</label>
              <input
                type="date"
                value={responseData.delivery_date}
                onChange={(e) => setResponseData({ ...responseData, delivery_date: e.target.value })}
                max={selectedRequirement.deadline.split("T")[0]}
                className="w-full p-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
              <textarea
                value={responseData.message}
                onChange={(e) => setResponseData({ ...responseData, message: e.target.value })}
                placeholder="Any additional information about your offer..."
                rows={4}
                className="w-full p-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 resize-none"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowResponseModal(false)}
                className="flex-1 neuro-button py-3 font-semibold text-gray-600 hover:text-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Response</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading requirements...</p>
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
              <Search className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                  Required Items
                </h1>
                <p className="text-gray-600 font-medium">Items that vendors are looking for</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="neuro-button px-6 py-3 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 placeholder-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="urgent">Urgent</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 neuro-inset bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 appearance-none"
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredRequirements.length} of {requirements.length} requirements
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>{requirements.filter((r) => r.urgency === "high").length} urgent</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{requirements.filter((r) => r.status === "active").length} active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Grid */}
        {filteredRequirements.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No requirements found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequirements.map((requirement, index) => (
              <div
                key={requirement.id}
                ref={(el) => el && (requirementsRef.current[index] = el)}
                className="neuro-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{requirement.item_name}</h3>
                    <p className="text-sm text-gray-600">{requirement.description}</p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(requirement.urgency)}`}
                    >
                      {requirement.urgency} priority
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(requirement.status)}`}
                    >
                      {requirement.status}
                    </span>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="neuro-card p-3 mb-4 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{requirement.requested_by}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{requirement.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{requirement.contact_info}</span>
                  </div>
                </div>

                {/* Requirements Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <p className="font-semibold">
                        {requirement.quantity_needed} {requirement.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Max Price:</span>
                      <p className="font-bold text-emerald-600">
                        ${requirement.max_price}/{requirement.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-semibold text-amber-600">
                        {new Date(requirement.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Posted:</span>
                      <p className="font-semibold">{new Date(requirement.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {requirement.additional_notes && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm text-gray-700 italic">"{requirement.additional_notes}"</p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleRespond(requirement)}
                  className="w-full neuro-button py-3 font-semibold text-emerald-600 hover:text-emerald-700 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  disabled={requirement.status === "fulfilled"}
                >
                  <Send className="w-4 h-4" />
                  <span>{requirement.status === "fulfilled" ? "Already Fulfilled" : "Send Quote"}</span>
                </button>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredRequirements.length > 0 && (
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Market Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="neuro-card p-4">
                <div className="text-2xl font-bold text-emerald-600">
                  {requirements.filter((r) => r.urgency === "high").length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="neuro-card p-4">
                <div className="text-2xl font-bold text-amber-600">
                  {requirements.filter((r) => r.urgency === "medium").length}
                </div>
                <div className="text-sm text-gray-600">Medium Priority</div>
              </div>
              <div className="neuro-card p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {requirements.filter((r) => r.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active Requests</div>
              </div>
              <div className="neuro-card p-4">
                <div className="text-2xl font-bold text-indigo-600">
                  ${Math.round(requirements.reduce((sum, r) => sum + r.max_price * r.quantity_needed, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponseModal />
    </div>
  )
}
