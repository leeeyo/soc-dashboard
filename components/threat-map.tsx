"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

// Mock data for threat origins
const mockThreatOrigins = [
  { lat: 37.7749, lng: -122.4194, intensity: 8, country: "United States" },
  { lat: 51.5074, lng: -0.1278, intensity: 5, country: "United Kingdom" },
  { lat: 39.9042, lng: 116.4074, intensity: 12, country: "China" },
  { lat: 55.7558, lng: 37.6173, intensity: 9, country: "Russia" },
  { lat: 35.6762, lng: 139.6503, intensity: 4, country: "Japan" },
  { lat: -33.8688, lng: 151.2093, intensity: 3, country: "Australia" },
  { lat: 52.52, lng: 13.405, intensity: 6, country: "Germany" },
  { lat: 48.8566, lng: 2.3522, intensity: 7, country: "France" },
]

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    window.addEventListener("resize", updateDimensions)
    updateDimensions()

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw world map outline (simplified)
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1

    // Simple world map outline (very simplified)
    const mapWidth = dimensions.width * 0.8
    const mapHeight = dimensions.height * 0.8
    const mapX = (dimensions.width - mapWidth) / 2
    const mapY = (dimensions.height - mapHeight) / 2

    ctx.strokeRect(mapX, mapY, mapWidth, mapHeight)

    // Draw threat points
    mockThreatOrigins.forEach((threat) => {
      // Convert lat/lng to x/y coordinates (simplified)
      const x = mapX + ((threat.lng + 180) / 360) * mapWidth
      const y = mapY + ((90 - threat.lat) / 180) * mapHeight

      // Draw threat point
      const radius = threat.intensity / 2
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3)
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)")
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)")

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(x, y, radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw point
      ctx.beginPath()
      ctx.fillStyle = "rgba(255, 0, 0, 0.8)"
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [dimensions])

  return (
    <Card className="relative overflow-hidden border-0 p-0">
      <canvas ref={canvasRef} className="h-full w-full bg-black/20" />
      <div className="absolute bottom-2 left-2 rounded bg-background/80 p-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500"></span>
          <span>Active Threats</span>
        </div>
      </div>
    </Card>
  )
}
