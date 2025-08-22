"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentAlerts } from "@/components/recent-alerts"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"
import { ThreatStats } from "@/components/threat-stats"

export default function DashboardHomePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <DashboardHeader title="CTI Portal" description="Overview of your security operations center" />
      <div className="grid h-full gap-4 p-4 md:grid-cols-2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Threat Statistics</CardTitle>
            <CardDescription>Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <ThreatStats />
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Threat Overview</CardTitle>
            <CardDescription>Real-time view of threats detected in your environment</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <Tabs defaultValue="alerts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
                <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mitre">
                <MitreAttackMatrix />
              </TabsContent>
              <TabsContent value="alerts">
                <RecentAlerts />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
