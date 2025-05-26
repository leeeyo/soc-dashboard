import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { AIReportGenerator } from "@/components/ai-report-generator"
import { RecentAIReports } from "@/components/recent-ai-reports"
import { Plus } from "lucide-react"

export default function AIGeneratedReportsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="AI-Generated Reports"
      />
      <div className="p-4">
        <Tabs defaultValue="generator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Report Generator</CardTitle>
                <CardDescription>Generate detailed security reports using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <AIReportGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI-Generated Reports</CardTitle>
                <CardDescription>View and manage your recent AI-generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAIReports />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
