"use client"

import { useEffect, useRef, useState } from "react"

// Mock data for IOC match rates over time
const mockIOCData = [
  { date: "May 16", matches: 42, total: 150 },
  { date: "May 17", matches: 56, total: 165 },
  { date: "May 18", matches: 48, total: 155 },
  { date: "May 19", matches: 65, total: 170 },
  { date: "May 20", matches: 72, total: 180 },
  { date: "May 21", matches: 68, total: 175 },
  { date: "May 22", matches: 78, total: 185 },
]

export function IOCMatchRates() {
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
    const padding = 40
    const chartWidth = dimensions.width - padding * 2
    const chartHeight = dimensions.height - padding * 2

    // Calculate match rates
    const matchRates = mockIOCData.map((d) => (d.matches / d.total) * 100)

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
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.moveTo(padding, y)
      ctx.lineTo(dimensions.width - padding, y)
    }

    // Vertical grid lines
    for (let i = 0; i < mockIOCData.length; i++) {
      const x = padding + (chartWidth / (mockIOCData.length - 1)) * i
      ctx.moveTo(x, padding)
      ctx.lineTo(x, dimensions.height - padding)
    }
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = 100 - i * 20
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(`${value}%`, padding - 10, y)
    }

    // X-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    for (let i = 0; i < mockIOCData.length; i++) {
      const x = padding + (chartWidth / (mockIOCData.length - 1)) * i
      ctx.fillText(mockIOCData[i].date, x, dimensions.height - padding + 10)
    }

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
    ctx.lineWidth = 2

    for (let i = 0; i < matchRates.length; i++) {
      const x = padding + (chartWidth / (matchRates.length - 1)) * i
      const y = padding + chartHeight - (chartHeight * matchRates[i]) / 100

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw points
    for (let i = 0; i < matchRates.length; i++) {
      const x = padding + (chartWidth / (matchRates.length - 1)) * i
      const y = padding + chartHeight - (chartHeight * matchRates[i]) / 100

      ctx.beginPath()
      ctx.fillStyle = "rgba(59, 130, 246, 1)"
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = "white"
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw title
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("IOC Match Rate (Last 7 Days)", dimensions.width / 2, 10)
  }, [dimensions])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
