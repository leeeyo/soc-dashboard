"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { IncidentsList } from "@/components/incidents-list"
import { IncidentHeatmap } from "@/components/incident-heatmap"
import { AnomalyDetection } from "@/components/anomaly-detection"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function IncidentsPage() {
  const router = useRouter()

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <DashboardHeader
        title="SOC Incident Dashboard"
        description="Monitor and manage security incidents"
        actions={
          <Button 
            variant="default" 
            size="sm"
            onClick={() => router.push('/reports/ai-generated')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />
      <div className="grid h-full gap-4 p-4 md:grid-cols-2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>Current security incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <IncidentsList />
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Anomaly Detection</CardTitle>
            <CardDescription>Unusual patterns and behaviors detected</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <AnomalyDetection />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
