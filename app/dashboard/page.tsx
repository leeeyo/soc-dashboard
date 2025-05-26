"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentAlerts } from "@/components/recent-alerts"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"
import { ThreatStats } from "@/components/threat-stats"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="SOC Dashboard" 
        description="Overview of your security operations center"
        actions={
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <ThreatStats />
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Threat Overview</CardTitle>
            <CardDescription>Real-time view of threats detected in your environment</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mitre">
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
