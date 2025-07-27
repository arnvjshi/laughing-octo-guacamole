"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Users, ShoppingCart, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate page entrance
    const tl = gsap.timeline()
    tl.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .fromTo(
        featuresRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
  }, [])

  const handleGetStarted = () => {
    router.push("/role-selection")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Group Buying for <span className="text-orange-500">Street Food Vendors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join local vendors to place bulk orders, split costs, and boost your profits together.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Start Buying Together
          </button>
        </div>
      </section>

      {/* How BulkBite Works */}
      <section ref={featuresRef} className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How BulkBite Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Groups */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Form Groups</h3>
              <p className="text-gray-600">Connect with nearby vendors in your locality to create buying groups.</p>
            </div>

            {/* Bulk Orders */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bulk Orders</h3>
              <p className="text-gray-600">Place large orders together to get better prices from suppliers.</p>
            </div>

            {/* Split Costs */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Split Costs</h3>
              <p className="text-gray-600">Share expenses fairly and boost everyone's profit margins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 px-4 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Saving?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of vendors already saving money through group buying.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-gray-800 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Choose Your Role
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
