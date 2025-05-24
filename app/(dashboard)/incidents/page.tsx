import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { IncidentsList } from "@/components/incidents-list"
import { IncidentHeatmap } from "@/components/incident-heatmap"
import { AnomalyDetection } from "@/components/anomaly-detection"
import { FileText, Filter } from "lucide-react"

export default function IncidentsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="SOC Incident Dashboard"
        description="Monitor and manage security incidents"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="default" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>Current security incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentsList />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Attack Origin Heatmap</CardTitle>
            <CardDescription>Geographic distribution of attack sources</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <IncidentHeatmap />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Anomaly Detection</CardTitle>
            <CardDescription>Unusual patterns and behaviors detected</CardDescription>
          </CardHeader>
          <CardContent>
            <AnomalyDetection />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
