"use client"
import type React from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import styles from "./v0Nasa.module.css"

type Effect = "default" | "spark" | "wave" | "vortex"
type AdditionalEffect = "explode" | "scatter" | "implode" | "spiral" | "morph"
type ColorMode = "default" | "sapphire" | "gold"

export default function V0ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    points: THREE.Points
    geometry: THREE.BufferGeometry
    originalPositions: Float32Array
    velocities: Float32Array
    phases: Float32Array
    intersectionPoint: THREE.Vector3 | null
    rotationX: number
    rotationY: number
    isDragging: boolean
    previousMouseX: number
    previousMouseY: number
    particleCount: number
  } | null>(null)

  // Clamp utility
  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
  }

  const dist = (px: number, py: number) => {
    const w = 0.045 // stroke width
    const spacing = 0.55 // letter spacing
    const startX = -1.1 // starting X position

    // N - letter at position 0
    const nx = startX
    const n = Math.min(
      // Left vertical stroke
      Math.abs(px - nx) < w && py > -0.3 && py < 0.3 ? Math.abs(px - nx) - w : 1e5,
      // Diagonal stroke
      (() => {
        const dx = 0.3
        const dy = -0.6
        const len = Math.sqrt(dx * dx + dy * dy)
        const t = clamp(((px - nx) * dx + (py - 0.3) * dy) / (len * len), 0, 1)
        const closestX = nx + t * dx
        const closestY = 0.3 + t * dy
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2) - w
      })(),
      // Right vertical stroke
      Math.abs(px - (nx + 0.3)) < w && py > -0.3 && py < 0.3 ? Math.abs(px - (nx + 0.3)) - w : 1e5,
    )

    // A - letter at position 1
    const ax = startX + spacing
    const a = Math.min(
      // Left diagonal
      (() => {
        const dx = 0.15
        const dy = 0.6
        const len = Math.sqrt(dx * dx + dy * dy)
        const t = clamp(((px - ax) * dx + (py - -0.3) * dy) / (len * len), 0, 1)
        const closestX = ax + t * dx
        const closestY = -0.3 + t * dy
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2) - w
      })(),
      // Right diagonal
      (() => {
        const dx = 0.15
        const dy = -0.6
        const len = Math.sqrt(dx * dx + dy * dy)
        const t = clamp(((px - (ax + 0.15)) * dx + (py - 0.3) * dy) / (len * len), 0, 1)
        const closestX = ax + 0.15 + t * dx
        const closestY = 0.3 + t * dy
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2) - w
      })(),
      // Horizontal bar
      Math.abs(py - 0) < w && px > ax + 0.05 && px < ax + 0.25 ? Math.abs(py) - w : 1e5,
    )

    // S - letter at position 2
    const sx = startX + spacing * 2
    const s = Math.min(
      // Top arc
      (() => {
        const cx = sx + 0.15
        const cy = 0.15
        const r = 0.15
        const d = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
        if (py > 0 && px < cx + 0.05) return Math.abs(d - r) - w
        return 1e5
      })(),
      // Bottom arc
      (() => {
        const cx = sx + 0.15
        const cy = -0.15
        const r = 0.15
        const d = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
        if (py < 0 && px > cx - 0.05) return Math.abs(d - r) - w
        return 1e5
      })(),
      // Middle connection
      Math.abs(py) < w * 1.5 && px > sx + 0.05 && px < sx + 0.25 ? Math.abs(py) - w : 1e5,
    )

    // A - letter at position 3 (second A)
    const a2x = startX + spacing * 3
    const a2 = Math.min(
      // Left diagonal
      (() => {
        const dx = 0.15
        const dy = 0.6
        const len = Math.sqrt(dx * dx + dy * dy)
        const t = clamp(((px - a2x) * dx + (py - -0.3) * dy) / (len * len), 0, 1)
        const closestX = a2x + t * dx
        const closestY = -0.3 + t * dy
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2) - w
      })(),
      // Right diagonal
      (() => {
        const dx = 0.15
        const dy = -0.6
        const len = Math.sqrt(dx * dx + dy * dy)
        const t = clamp(((px - (a2x + 0.15)) * dx + (py - 0.3) * dy) / (len * len), 0, 1)
        const closestX = a2x + 0.15 + t * dx
        const closestY = 0.3 + t * dy
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2) - w
      })(),
      // Horizontal bar
      Math.abs(py - 0) < w && px > a2x + 0.05 && px < a2x + 0.25 ? Math.abs(py) - w : 1e5,
    )

    return Math.min(n, a, s, a2)
  }

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Establecer el tamaño del canvas con device pixel ratio
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0) // Transparent background
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

    // Generate particles
    const numParticles = 15000
    const thickness = 0.2
    const positions = new Float32Array(numParticles * 3)
    const colors = new Float32Array(numParticles * 3)
    let i = 0
    const maxAttempts = 1500000
    let attempts = 0
    while (i < numParticles && attempts < maxAttempts) {
      attempts++
      const x = Math.random() * 4 - 2
      const y = Math.random() * 2 - 1
      const z = Math.random() * thickness - thickness / 2
      if (dist(x, y) <= 0) {
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
        i++
      }
    }
    const originalPositions = positions.slice()
    const phases = new Float32Array(i)
    const velocities = new Float32Array(i * 3)
    for (let j = 0; j < i; j++) {
      phases[j] = Math.random() * Math.PI * 2
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({
      size: 0.005,
      sizeAttenuation: true,
      vertexColors: true,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)
    camera.position.set(0, 0, 1.5)

    // Store scene data
    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      geometry,
      originalPositions,
      velocities,
      phases,
      intersectionPoint: null,
      rotationX: 0,
      rotationY: 0,
      isDragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      particleCount: i,
    }

    // Mouse move handler for particle effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!sceneRef.current) return
      const rect = canvas.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top
      mouse.x = (offsetX / canvas.clientWidth) * 2 - 1
      mouse.y = -(offsetY / canvas.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersect = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, intersect)) {
        sceneRef.current.intersectionPoint = intersect
      }
    }
    const handleMouseLeave = () => {
      if (sceneRef.current) {
        sceneRef.current.intersectionPoint = null
      }
    }
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Animation loop
    let animationId: number
    const animate = (timestamp: number) => {
      if (!sceneRef.current) return
      const time = timestamp * 0.001
      const {
        geometry,
        points,
        originalPositions,
        velocities,
        phases,
        intersectionPoint,
        rotationX,
        rotationY,
        particleCount,
      } = sceneRef.current
      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute
      const radiusSwirl = 0.01
      const angularSpeed = 1
      const effectRadius = 0.3
      const repelStrength = 0.05 // Always use default repel strength
      const attractStrength = 0.05
      const damping = 0.95

      // Update rotations
      points.rotation.y += (rotationY - points.rotation.y) * 0.1
      points.rotation.x += (rotationX - points.rotation.x) * 0.1

      // Compute inverse quaternion
      const euler = new THREE.Euler(points.rotation.x, points.rotation.y, points.rotation.z, "XYZ")
      const inverseQuaternion = new THREE.Quaternion().setFromEuler(euler).invert()
      let localIntersection: THREE.Vector3 | null = null
      if (intersectionPoint) {
        localIntersection = intersectionPoint.clone().applyQuaternion(inverseQuaternion)
      }

      // Update particles
      for (let j = 0; j < particleCount; j++) {
        const idx = j * 3
        const ox = originalPositions[idx]
        const oy = originalPositions[idx + 1]
        const oz = originalPositions[idx + 2]
        const theta = angularSpeed * time + phases[j]
        const swirlDx = radiusSwirl * Math.cos(theta)
        const swirlDy = radiusSwirl * Math.sin(theta)
        const targetX = ox + swirlDx
        const targetY = oy + swirlDy
        const targetZ = oz
        let px = positionAttribute.getX(j)
        let py = positionAttribute.getY(j)
        let pz = positionAttribute.getZ(j)
        let vx = velocities[idx]
        let vy = velocities[idx + 1]
        let vz = velocities[idx + 2]

        if (localIntersection) {
          const dx = px - localIntersection.x
          const dy = py - localIntersection.y
          const dz = pz - localIntersection.z
          const distSq = dx * dx + dy * dy + dz * dz
          const dist = Math.sqrt(distSq)
          if (distSq < effectRadius * effectRadius && distSq > 0.0001) {
            const force = (1 - dist / effectRadius) * repelStrength
            vx += (dx / dist) * force
            vy += (dy / dist) * force
            vz += (dz / dist) * force
          }
        }

        // Attract to target
        const attractDx = targetX - px
        const attractDy = targetY - py
        const attractDz = targetZ - pz
        vx += attractDx * attractStrength
        vy += attractDy * attractStrength
        vz += attractDz * attractStrength

        // Damping
        vx *= damping
        vy *= damping
        vz *= damping

        // Update position
        px += vx
        py += vy
        pz += vz
        positionAttribute.setXYZ(j, px, py, pz)
        velocities[idx] = vx
        velocities[idx + 1] = vy
        velocities[idx + 2] = vz

        colorAttribute.setXYZ(j, 4, 4, 4)
      }
      positionAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    // Resize handler
    const handleResize = () => {
      const newWidth = canvas.clientWidth
      const newHeight = canvas.clientHeight
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = newWidth * dpr
      canvas.height = newHeight * dpr
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(dpr)
      renderer.setSize(newWidth, newHeight, false)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  // Mouse drag handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!sceneRef.current) return
    sceneRef.current.isDragging = true
    sceneRef.current.previousMouseX = event.clientX
    sceneRef.current.previousMouseY = event.clientY
  }
  const handleMouseMoveDrag = (event: React.MouseEvent) => {
    if (!sceneRef.current || !sceneRef.current.isDragging) return
    const deltaX = event.clientX - sceneRef.current.previousMouseX
    const deltaY = event.clientY - sceneRef.current.previousMouseY
    sceneRef.current.rotationY -= deltaX * 0.005
    sceneRef.current.rotationX -= deltaY * 0.005
    sceneRef.current.previousMouseX = event.clientX
    sceneRef.current.previousMouseY = event.clientY
  }
  const handleMouseUp = () => {
    if (sceneRef.current) {
      sceneRef.current.isDragging = false
    }
  }

  // Touch handlers
  const handleTouchStart = (event: React.TouchEvent) => {
    if (!sceneRef.current) return
    sceneRef.current.isDragging = true
    sceneRef.current.previousMouseX = event.touches[0].clientX
    sceneRef.current.previousMouseY = event.touches[0].clientY
  }
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!sceneRef.current || !sceneRef.current.isDragging) return
    const deltaX = event.touches[0].clientX - sceneRef.current.previousMouseX
    const deltaY = event.touches[0].clientY - sceneRef.current.previousMouseY
    sceneRef.current.rotationY -= deltaX * 0.005
    sceneRef.current.rotationX -= deltaY * 0.005
    sceneRef.current.previousMouseX = event.touches[0].clientX
    sceneRef.current.previousMouseY = event.touches[0].clientY
  }
  const handleTouchEnd = () => {
    if (sceneRef.current) {
      sceneRef.current.isDragging = false
    }
  }

  return (
    <div className={styles.container1}>
      <canvas
        ref={canvasRef}
        className="block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveDrag}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
