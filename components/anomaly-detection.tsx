"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, ArrowRight } from "lucide-react"

// Mock anomaly data
const anomalies = [
  {
    id: "anomaly-1",
    title: "Unusual Login Time",
    description: "Admin user logged in at 3:15 AM, outside normal working hours",
    severity: "Medium",
    time: "3:15 AM",
    date: "May 22, 2023",
    confidence: 85,
  },
  {
    id: "anomaly-2",
    title: "Excessive Failed Logins",
    description: "User account had 15 failed login attempts in 5 minutes",
    severity: "High",
    time: "10:30 AM",
    date: "May 22, 2023",
    confidence: 92,
  },
  {
    id: "anomaly-3",
    title: "Unusual File Access Pattern",
    description: "User accessed 50+ sensitive files in quick succession",
    severity: "Medium",
    time: "2:45 PM",
    date: "May 21, 2023",
    confidence: 78,
  },
  {
    id: "anomaly-4",
    title: "Abnormal Network Traffic",
    description: "Workstation sending unusually large data volumes to external IP",
    severity: "High",
    time: "11:20 AM",
    date: "May 21, 2023",
    confidence: 88,
  },
]

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-500 hover:bg-red-600"
    case "high":
      return "bg-orange-500 hover:bg-orange-600"
    case "medium":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "low":
      return "bg-green-500 hover:bg-green-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 90) return "text-red-500"
  if (confidence >= 80) return "text-orange-500"
  if (confidence >= 70) return "text-yellow-500"
  return "text-green-500"
}

export function AnomalyDetection() {
  return (
    <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "300px" }}>
      {anomalies.map((anomaly) => (
        <Card key={anomaly.id} className="p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{anomaly.title}</span>
            </div>
            <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {anomaly.time} - {anomaly.date}
          </p>
          <p className="mt-1 text-sm">{anomaly.description}</p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs">Confidence:</span>
              <span className={`text-xs font-medium ${getConfidenceColor(anomaly.confidence)}`}>
                {anomaly.confidence}%
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Investigate <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
