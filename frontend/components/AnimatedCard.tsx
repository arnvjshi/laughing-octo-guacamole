"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "scale" | "rotate"
  trigger?: "hover" | "scroll" | "immediate"
  duration?: number
}

export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
  direction = "up",
  trigger = "scroll",
  duration = 0.8,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return undefined

    const element = cardRef.current

    // Initial state based on direction
    const getInitialState = () => {
      switch (direction) {
        case "up":
          return { y: 50, opacity: 0 }
        case "down":
          return { y: -50, opacity: 0 }
        case "left":
          return { x: -50, opacity: 0 }
        case "right":
          return { x: 50, opacity: 0 }
        case "scale":
          return { scale: 0.8, opacity: 0 }
        case "rotate":
          return { rotation: 10, scale: 0.9, opacity: 0 }
        default:
          return { y: 50, opacity: 0 }
      }
    }

    const finalState = { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }

    if (trigger === "immediate") {
      gsap.fromTo(element, getInitialState(), {
        ...finalState,
        duration,
        delay,
        ease: "power3.out",
      })
    } else if (trigger === "scroll") {
      gsap.fromTo(element, getInitialState(), {
        ...finalState,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }

    // Hover animations
    if (trigger === "hover") {
      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.05,
          y: -5,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      element.addEventListener("mouseenter", handleMouseEnter)
      element.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter)
        element.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
    return undefined
  }, [delay, direction, trigger, duration])

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  )
}
