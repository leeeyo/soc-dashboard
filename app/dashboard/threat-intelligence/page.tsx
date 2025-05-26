"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { MaliciousIndicators } from "@/components/malicious-indicators"
import { ThreatTimeline } from "@/components/threat-timeline"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"

export default function ThreatIntelligencePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <DashboardHeader
        title="Threat Intelligence Overview"
        description="Track and analyze malicious indicators and threat patterns"
      />
      <div className="grid h-full gap-4 p-4 md:grid-cols-2">
        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Malicious Indicators</CardTitle>
            <CardDescription>Track malicious IPs, domains, and file hashes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <MaliciousIndicators />
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Threat Timeline</CardTitle>
            <CardDescription>Recent threat activity timeline</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <ThreatTimeline />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
