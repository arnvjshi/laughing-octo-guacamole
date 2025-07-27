"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { gsap } from "gsap"

interface GlowingButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  glowIntensity?: number
}

export default function GlowingButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  glowIntensity = 1,
}: GlowingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!buttonRef.current || !glowRef.current) return

    const button = buttonRef.current
    const glow = glowRef.current

    // Pulsing glow animation
    gsap.to(glow, {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(glow, {
        scale: 1.3,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(glow, {
        scale: 1.1,
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    button.addEventListener("mouseenter", handleMouseEnter)
    button.addEventListener("mouseleave", handleMouseLeave)
    button.addEventListener("click", handleClick)

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter)
      button.removeEventListener("mouseleave", handleMouseLeave)
      button.removeEventListener("click", handleClick)
    }
  }, [])

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25"
      case "secondary":
        return "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-gray-500/25"
      case "accent":
        return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25"
      default:
        return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm"
      case "md":
        return "px-6 py-3 text-base"
      case "lg":
        return "px-8 py-4 text-lg"
      default:
        return "px-6 py-3 text-base"
    }
  }

  return (
    <div className="relative inline-block">
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`absolute inset-0 rounded-lg blur-lg ${getVariantClasses()} opacity-60`}
        style={{ opacity: glowIntensity * 0.6 }}
      />

      {/* Button */}
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative z-10 font-semibold rounded-lg transition-all duration-200
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
      >
        {children}
      </button>
    </div>
  )
}
