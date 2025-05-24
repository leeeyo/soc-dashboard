import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DetectionMetrics } from "@/components/detection-metrics"
import { FalsePositiveAnalysis } from "@/components/false-positive-analysis"
import { IOCMatchRates } from "@/components/ioc-match-rates"
import { Calendar, Download } from "lucide-react"

export default function DetectionPerformancePage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Threat Detection Performance"
        description="Monitor detection effectiveness and false positive rates"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Detection Metrics</CardTitle>
            <CardDescription>Key performance indicators for threat detection</CardDescription>
          </CardHeader>
          <CardContent>
            <DetectionMetrics />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>IOC Match Rates</CardTitle>
            <CardDescription>Real-time indicator of compromise match rates</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <IOCMatchRates />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>False Positive Analysis</CardTitle>
            <CardDescription>Comparison of false positives to confirmed threats</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <FalsePositiveAnalysis />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
