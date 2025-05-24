"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

// Mock data for incident origins
const mockIncidentOrigins = [
  { lat: 37.7749, lng: -122.4194, count: 15, country: "United States" },
  { lat: 51.5074, lng: -0.1278, count: 8, country: "United Kingdom" },
  { lat: 39.9042, lng: 116.4074, count: 25, country: "China" },
  { lat: 55.7558, lng: 37.6173, count: 18, country: "Russia" },
  { lat: 35.6762, lng: 139.6503, count: 6, country: "Japan" },
  { lat: -33.8688, lng: 151.2093, count: 4, country: "Australia" },
  { lat: 52.52, lng: 13.405, count: 10, country: "Germany" },
  { lat: 48.8566, lng: 2.3522, count: 12, country: "France" },
]

export function IncidentHeatmap() {
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

    // Draw heatmap points
    mockIncidentOrigins.forEach((point) => {
      // Convert lat/lng to x/y coordinates (simplified)
      const x = mapX + ((point.lng + 180) / 360) * mapWidth
      const y = mapY + ((90 - point.lat) / 180) * mapHeight

      // Draw heatmap point
      const radius = Math.min(30, Math.max(5, point.count / 2))
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)")
      gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.6)")
      gradient.addColorStop(1, "rgba(255, 255, 0, 0)")

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw count
      if (point.count > 10) {
        ctx.fillStyle = "white"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(point.count.toString(), x, y)
      }
    })

    // Draw legend
    const legendX = 10
    const legendY = dimensions.height - 60

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(legendX, legendY, 120, 50)

    ctx.fillStyle = "white"
    ctx.font = "10px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Incident Count", legendX + 10, legendY + 15)

    // Draw legend gradient
    const gradientLegend = ctx.createLinearGradient(legendX + 10, legendY + 30, legendX + 100, legendY + 30)
    gradientLegend.addColorStop(0, "rgba(255, 255, 0, 1)")
    gradientLegend.addColorStop(0.5, "rgba(255, 165, 0, 1)")
    gradientLegend.addColorStop(1, "rgba(255, 0, 0, 1)")

    ctx.fillStyle = gradientLegend
    ctx.fillRect(legendX + 10, legendY + 25, 90, 10)

    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.fillText("Low", legendX + 10, legendY + 45)
    ctx.textAlign = "right"
    ctx.fillText("High", legendX + 100, legendY + 45)
  }, [dimensions])

  return (
    <Card className="relative overflow-hidden border-0 p-0">
      <canvas ref={canvasRef} className="h-full w-full bg-black/20" />
    </Card>
  )
}
