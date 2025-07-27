"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  Package,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Crown,
  Award,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import ThreeBackground from "../../components/ThreeBackground"
import AnimatedCard from "../../components/AnimatedCard"
import FloatingElements from "../../components/FloatingElements"
import GlowingButton from "../../components/GlowingButton"

interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  type: "vendor" | "supplier"
  businessName: string
  address: string
  description: string
  foodType?: string
  primaryLocation?: string
  avatar?: string
  joinedDate: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const profileRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Mock user profile data (in real app, fetch from API)
    const mockProfile: UserProfile = {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      phone: "+1 (555) 123-4567",
      type: parsedUser.type,
      businessName: parsedUser.type === "vendor" ? "Street Food Corner" : "Fresh Produce Co",
      address: "123 Market Street, Downtown District, City 12345",
      description:
        parsedUser.type === "vendor"
          ? "Serving delicious street food with fresh ingredients and authentic flavors."
          : "Premium supplier of fresh produce and quality ingredients for local vendors.",
      foodType: parsedUser.type === "vendor" ? "Asian Street Food" : undefined,
      primaryLocation: parsedUser.type === "vendor" ? "Downtown Market" : undefined,
      joinedDate: "2024-01-15",
    }

    setTimeout(() => {
      setUser(mockProfile)
      setFormData(mockProfile)
      setIsLoading(false)
    }, 800)
  }, [router])

  useEffect(() => {
    if (!isLoading && containerRef.current && headerRef.current) {
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

  const handleBackToDashboard = () => {
    gsap.to(containerRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push(user?.type === "vendor" ? "/vendor" : "/supplier"),
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    gsap.fromTo(
      ".edit-form",
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
    )
  }

  const handleSave = async () => {
    try {
      // Simulate API call with loading animation
      const saveBtn = document.querySelector(".save-btn")
      if (saveBtn) {
        gsap.to(saveBtn, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...formData } as UserProfile
      setUser(updatedUser)

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...currentUser, name: updatedUser.name, email: updatedUser.email }))

      setIsEditing(false)

      // Success animation
      gsap.fromTo(
        ".success-message",
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      )

      setTimeout(() => {
        gsap.to(".success-message", { opacity: 0, y: -20, duration: 0.3 })
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleCancel = () => {
    setFormData(user || {})
    gsap.to(".edit-form", {
      opacity: 0,
      scale: 0.9,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setIsEditing(false),
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTabChange = (tabId: string) => {
    gsap.to(`.tab-content`, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tabId)
        gsap.to(`.tab-content`, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      },
    })
  }

  const renderProfile = () => (
    <div className="space-y-8 tab-content">
      {/* Enhanced Profile Header */}
      <AnimatedCard direction="up" delay={0.1}>
        <div className="glass-card p-10 border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-purple-50/50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-8 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-4xl font-bold">{user?.name.charAt(0)}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200 border-4 border-orange-100">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {user?.name}
                  </h1>
                  <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                </div>

                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    {user?.type === "vendor" ? (
                      <Store className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Package className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-sm font-bold capitalize">
                      {user?.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600 font-medium">
                      Member since {new Date(user?.joinedDate || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">{user?.description}</p>

                <div className="flex space-x-4">
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✅ Verified Account
                  </div>
                  <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ⭐ Premium Member
                  </div>
                </div>
              </div>

              <GlowingButton onClick={handleEdit} variant="accent" className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </GlowingButton>
            </div>

            {/* Enhanced Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedCard direction="left" delay={0.2}>
                <div className="neuro-card p-8 hover:shadow-2xl transition-all duration-300 border border-white/10">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700 font-medium">{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <Phone className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 font-medium">{user?.phone}</span>
                    </div>
                    <div className="flex items-start space-x-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-purple-500 mt-1" />
                      <span className="text-gray-700 font-medium leading-relaxed">{user?.address}</span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard direction="right" delay={0.3}>
                <div className="neuro-card p-8 hover:shadow-2xl transition-all duration-300 border border-white/10">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    Business Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                      <Store className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700 font-medium">{user?.businessName}</span>
                    </div>
                    {user?.type === "vendor" && (
                      <>
                        <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                          <Package className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700 font-medium">{user?.foodType}</span>
                        </div>
                        <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-indigo-500" />
                          <span className="text-gray-700 font-medium">{user?.primaryLocation}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto edit-form border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Edit Profile
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  />
                </div>
              </div>

              {user?.type === "vendor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Food Type</label>
                    <input
                      type="text"
                      name="foodType"
                      value={formData.foodType || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Primary Location</label>
                    <input
                      type="text"
                      name="primaryLocation"
                      value={formData.primaryLocation || ""}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 rounded-xl border-0 neuro-inset bg-gradient-to-r from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none text-lg"
                />
              </div>

              <div className="flex space-x-6 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 neuro-button py-4 font-bold text-gray-600 hover:text-gray-700 transition-colors duration-200 text-lg"
                >
                  Cancel
                </button>
                <GlowingButton
                  onClick={handleSave}
                  size="lg"
                  className="flex-1 save-btn flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </GlowingButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      <div className="success-message fixed top-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-2xl opacity-0 z-50 flex items-center space-x-3">
        <Sparkles className="w-5 h-5" />
        <span className="font-bold">Profile updated successfully!</span>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-8 tab-content">
      <AnimatedCard direction="up" delay={0.1}>
        <div className="glass-card p-8 border border-white/20 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Security Settings
          </h3>

          <div className="space-y-6">
            <AnimatedCard direction="left" delay={0.2}>
              <div className="neuro-card p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Change Password</h4>
                    <p className="text-gray-600">Update your account password for better security</p>
                  </div>
                </div>
                <GlowingButton variant="secondary" size="sm">
                  Change
                </GlowingButton>
              </div>
            </AnimatedCard>

            <AnimatedCard direction="right" delay={0.3}>
              <div className="neuro-card p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Two-Factor Authentication</h4>
                    <p className="text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <GlowingButton variant="accent" size="sm">
                  Enable
                </GlowingButton>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard direction="up" delay={0.4}>
        <div className="glass-card p-8 border border-white/20 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Notification Preferences
          </h3>

          <div className="space-y-6">
            <AnimatedCard direction="left" delay={0.5}>
              <div className="neuro-card p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Email Notifications</h4>
                    <p className="text-gray-600">Receive important updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:to-orange-500"></div>
                </label>
              </div>
            </AnimatedCard>

            <AnimatedCard direction="right" delay={0.6}>
              <div className="neuro-card p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Push Notifications</h4>
                    <p className="text-gray-600">Get instant notifications on your device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:to-orange-500"></div>
                </label>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )

  const renderBilling = () => (
    <div className="space-y-8 tab-content">
      <AnimatedCard direction="up" delay={0.1}>
        <div className="glass-card p-8 border border-white/20 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center mr-4">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            Billing Information
          </h3>

          <AnimatedCard direction="scale" delay={0.2}>
            <div className="neuro-card p-12 text-center hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                  <CreditCard className="w-10 h-10 text-gray-400" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/20 to-purple-400/20 animate-pulse"></div>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">No Payment Methods</h4>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Add a payment method to unlock premium features and enjoy seamless transactions
              </p>
              <GlowingButton size="lg" className="shadow-2xl">
                <CreditCard className="w-5 h-5 mr-2" />
                Add Payment Method
              </GlowingButton>
            </div>
          </AnimatedCard>
        </div>
      </AnimatedCard>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <ThreeBackground variant="geometric" color="#f97316" intensity={0.3} />
        <FloatingElements />

        <AnimatedCard direction="scale" trigger="immediate" className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 animate-spin">
                <div className="absolute inset-3 rounded-full bg-white"></div>
              </div>
              <User className="absolute inset-0 m-auto w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Loading Your Profile
            </h3>
            <p className="text-gray-600 font-medium text-lg">Setting up your personalized experience...</p>
            <div className="flex justify-center mt-6 space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-orange-400 to-purple-400 rounded-full animate-bounce"
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
      <ThreeBackground variant="waves" color="#f97316" intensity={0.2} />
      <FloatingElements />

      {/* Enhanced Header */}
      <div
        ref={headerRef}
        className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 p-4 mb-8 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GlowingButton onClick={handleBackToDashboard} variant="secondary" size="sm" className="!p-2 !rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </GlowingButton>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-800">
                Bulk<span className="text-orange-500">Bite</span>
              </h1>
              <Crown className="w-6 h-6 text-orange-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-gray-600">Account Settings</span>
              <p className="font-bold text-gray-800">Welcome, {user?.name}</p>
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

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 space-y-8"
      >
        {/* Enhanced Tab Navigation */}
        <AnimatedCard direction="up" delay={0.1}>
          <div className="glass-card p-3 border border-white/20 shadow-2xl">
            <div className="flex space-x-3">
              {[
                { id: "profile", label: "Profile", icon: User, gradient: "from-blue-400 to-blue-500" },
                { id: "settings", label: "Settings", icon: Shield, gradient: "from-red-400 to-red-500" },
                { id: "billing", label: "Billing", icon: CreditCard, gradient: "from-green-400 to-green-500" },
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl scale-105`
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 hover:text-orange-700 hover:scale-105"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <Sparkles className="w-4 h-4 animate-pulse" />}
                  </button>
                )
              })}
            </div>
          </div>
        </AnimatedCard>

        {/* Tab Content */}
        {activeTab === "profile" && renderProfile()}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "billing" && renderBilling()}
      </div>
    </div>
  )
}
