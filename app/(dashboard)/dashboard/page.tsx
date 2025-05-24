import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentAlerts } from "@/components/recent-alerts"
import { ThreatMap } from "@/components/threat-map"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"
import { ThreatStats } from "@/components/threat-stats"

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="SOC Dashboard" description="Overview of your security operations center" />
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <ThreatStats />
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Threat Overview</CardTitle>
            <CardDescription>Real-time view of threats detected in your environment</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="map">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map">Threat Map</TabsTrigger>
                <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
                <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="map" className="h-[400px]">
                <ThreatMap />
              </TabsContent>
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
