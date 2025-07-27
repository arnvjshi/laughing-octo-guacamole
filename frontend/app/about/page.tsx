"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Users, ShoppingCart, TrendingUp, Heart, Target, Award } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate page entrance
    const tl = gsap.timeline()
    tl.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .fromTo(
        missionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(
        valuesRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3",
      )
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About <span className="text-orange-500">BulkBite</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're revolutionizing how street food vendors source their ingredients by enabling collaborative bulk
            purchasing that reduces costs and builds stronger communities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To empower street food vendors with the tools and community they need to thrive through collaborative
              purchasing and shared success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community First</h3>
              <p className="text-gray-600">
                Building strong networks of vendors who support each other's growth and success.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Cost Efficiency</h3>
              <p className="text-gray-600">
                Reducing operational costs through bulk purchasing power and shared resources.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Simple Solutions</h3>
              <p className="text-gray-600">Making bulk purchasing accessible and easy for vendors of all sizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do at BulkBite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Empathy</h3>
              <p className="text-gray-600">
                We understand the challenges faced by street food vendors and design solutions with their needs at
                heart.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Clear pricing, honest communication, and transparent processes in all our interactions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Continuously improving our platform to deliver the best possible experience for our users.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Collaboration</h3>
              <p className="text-gray-600">
                Fostering partnerships between vendors, suppliers, and communities for mutual benefit.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Embracing new technologies and approaches to solve traditional business challenges.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Making our platform easy to use and accessible to vendors regardless of their technical expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              BulkBite was born from a simple observation: street food vendors, despite being competitors, often face
              the same challenges when sourcing ingredients. High costs, minimum order quantities, and limited supplier
              relationships were holding back talented entrepreneurs.
            </p>
            <p className="mb-6">
              We realized that by working together, these vendors could leverage collective purchasing power to reduce
              costs, access better suppliers, and ultimately serve their communities better. What started as a local
              initiative has grown into a platform that connects vendors and suppliers across regions.
            </p>
            <p>
              Today, BulkBite is proud to support hundreds of vendors in building sustainable, profitable businesses
              while fostering a sense of community and collaboration in the street food industry.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
