"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ThreeBackgroundProps {
  variant?: "particles" | "waves" | "geometric" | "food"
  color?: string
  intensity?: number
}

export default function ThreeBackground({
  variant = "particles",
  color = "#f97316",
  intensity = 1,
}: ThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer

    // Create different variants
    let particles: THREE.Points
    let geometry: THREE.BufferGeometry
    let material: THREE.PointsMaterial | THREE.ShaderMaterial

    switch (variant) {
      case "particles":
        geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(2000 * 3)
        const colors = new Float32Array(2000 * 3)

        for (let i = 0; i < 2000 * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 100
          positions[i + 1] = (Math.random() - 0.5) * 100
          positions[i + 2] = (Math.random() - 0.5) * 100

          const colorObj = new THREE.Color(color)
          colors[i] = colorObj.r + Math.random() * 0.3
          colors[i + 1] = colorObj.g + Math.random() * 0.3
          colors[i + 2] = colorObj.b + Math.random() * 0.3
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

        material = new THREE.PointsMaterial({
          size: 2,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        })

        particles = new THREE.Points(geometry, material)
        scene.add(particles)
        break

      case "waves":
        geometry = new THREE.PlaneGeometry(100, 100, 50, 50)
        const positionAttribute = geometry.getAttribute("position")

        material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(color) },
          },
          vertexShader: `
            uniform float time;
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              vec3 pos = position;
              pos.z += sin(pos.x * 0.1 + time) * 5.0 + cos(pos.y * 0.1 + time) * 3.0;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            varying vec3 vPosition;
            void main() {
              float alpha = 0.3 + sin(vPosition.x * 0.01) * 0.2;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          wireframe: true,
        })

        particles = new THREE.Mesh(geometry, material)
        scene.add(particles)
        break

      case "food":
        // Create floating food-related shapes
        const foodGeometries = [
          new THREE.SphereGeometry(0.5, 8, 6), // Tomato
          new THREE.CylinderGeometry(0.3, 0.3, 1, 8), // Carrot
          new THREE.BoxGeometry(0.8, 0.8, 0.2), // Bread slice
        ]

        for (let i = 0; i < 50; i++) {
          const geom = foodGeometries[Math.floor(Math.random() * foodGeometries.length)]
          const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
            transparent: true,
            opacity: 0.4,
          })

          const mesh = new THREE.Mesh(geom, mat)
          mesh.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100)
          mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
          scene.add(mesh)
        }
        break
    }

    camera.position.z = 50

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      if (variant === "particles" && particles) {
        particles.rotation.x = time * 0.1
        particles.rotation.y = time * 0.05
      } else if (variant === "waves" && material instanceof THREE.ShaderMaterial) {
        material.uniforms.time.value = time
      } else if (variant === "food") {
        scene.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.01
            child.rotation.y += 0.01
            child.position.y += Math.sin(time + index) * 0.02
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [variant, color, intensity])

  return <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: intensity }} />
}
