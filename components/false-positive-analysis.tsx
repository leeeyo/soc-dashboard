"use client"

import { useEffect, useRef, useState } from "react"

// Mock data for false positive analysis
const mockFalsePositiveData = [
  { category: "Network", falsePositives: 12, confirmedThreats: 45 },
  { category: "Endpoint", falsePositives: 8, confirmedThreats: 32 },
  { category: "User", falsePositives: 15, confirmedThreats: 18 },
  { category: "Application", falsePositives: 5, confirmedThreats: 27 },
  { category: "Cloud", falsePositives: 10, confirmedThreats: 22 },
]

export function FalsePositiveAnalysis() {
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

    // Chart dimensions
    const padding = 50
    const chartWidth = dimensions.width - padding * 2
    const chartHeight = dimensions.height - padding * 2

    // Bar chart properties
    const barCount = mockFalsePositiveData.length
    const barWidth = chartWidth / barCount / 3
    const barSpacing = barWidth / 2

    // Find max value for scaling
    const maxValue = Math.max(...mockFalsePositiveData.map((d) => Math.max(d.falsePositives, d.confirmedThreats)))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, dimensions.height - padding)
    ctx.lineTo(dimensions.width - padding, dimensions.height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, dimensions.height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.moveTo(padding, y)
      ctx.lineTo(dimensions.width - padding, y)
    }
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    // Y-axis labels
    for (let i = 0; i <= gridLines; i++) {
      const value = Math.round((maxValue / gridLines) * (gridLines - i))
      const y = padding + (chartHeight / gridLines) * i
      ctx.fillText(value.toString(), padding - 10, y)
    }

    // Draw bars
    mockFalsePositiveData.forEach((data, index) => {
      const x = padding + (chartWidth / barCount) * index + barWidth

      // False positives bar
      const fpHeight = (data.falsePositives / maxValue) * chartHeight
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)" // Red
      ctx.fillRect(x, dimensions.height - padding - fpHeight, barWidth, fpHeight)

      // Confirmed threats bar
      const ctHeight = (data.confirmedThreats / maxValue) * chartHeight
      ctx.fillStyle = "rgba(34, 197, 94, 0.7)" // Green
      ctx.fillRect(x + barWidth + barSpacing, dimensions.height - padding - ctHeight, barWidth, ctHeight)

      // Category label
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(data.category, x + barWidth + barSpacing / 2, dimensions.height - padding + 10)
    })

    // Draw legend
    const legendX = dimensions.width - padding - 120
    const legendY = padding

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(legendX, legendY, 120, 50)

    // False positives legend
    ctx.fillStyle = "rgba(239, 68, 68, 0.7)"
    ctx.fillRect(legendX + 10, legendY + 15, 15, 10)

    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("False Positives", legendX + 35, legendY + 20)

    // Confirmed threats legend
    ctx.fillStyle = "rgba(34, 197, 94, 0.7)"
    ctx.fillRect(legendX + 10, legendY + 35, 15, 10)

    ctx.fillStyle = "white"
    ctx.fillText("Confirmed Threats", legendX + 35, legendY + 40)

    // Draw title
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("False Positives vs. Confirmed Threats", dimensions.width / 2, 10)
  }, [dimensions])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
