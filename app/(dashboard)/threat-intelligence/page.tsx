import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { MaliciousIndicators } from "@/components/malicious-indicators"
import { ThreatTimeline } from "@/components/threat-timeline"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"
import { ThreatMap } from "@/components/threat-map"

export default function ThreatIntelligencePage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Threat Intelligence Overview"
        description="Track and analyze malicious indicators and threat patterns"
      />
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Malicious Indicators</CardTitle>
            <CardDescription>Track malicious IPs, domains, and file hashes</CardDescription>
          </CardHeader>
          <CardContent>
            <MaliciousIndicators />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Threat Timeline</CardTitle>
            <CardDescription>Recent threat activity timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ThreatTimeline />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Threat Origin Map</CardTitle>
            <CardDescription>Geographic distribution of threat origins</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ThreatMap />
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>MITRE ATT&CK Framework Mapping</CardTitle>
            <CardDescription>Mapping of detected threats to MITRE ATT&CK techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <MitreAttackMatrix />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
