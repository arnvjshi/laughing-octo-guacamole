"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ShoppingCart, Package, Users, Star, TrendingUp, Zap } from "lucide-react"

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const icons = containerRef.current.querySelectorAll(".floating-icon")

    icons.forEach((icon, index) => {
      // Random initial position
      gsap.set(icon, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      })

      // Floating animation
      gsap.to(icon, {
        y: `+=${Math.random() * 100 - 50}`,
        x: `+=${Math.random() * 100 - 50}`,
        rotation: `+=${Math.random() * 180 - 90}`,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
      })

      // Pulse animation
      gsap.to(icon, {
        scale: `+=${Math.random() * 0.3}`,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 2,
      })
    })
  }, [])

  const icons = [ShoppingCart, Package, Users, Star, TrendingUp, Zap]

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {icons.map((Icon, index) => (
        <div key={index} className="floating-icon absolute opacity-10">
          <Icon className="w-8 h-8 text-orange-500" />
        </div>
      ))}
    </div>
  )
}
