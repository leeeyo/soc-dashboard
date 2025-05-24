import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Mock timeline data
const timelineEvents = [
  {
    id: "event-1",
    time: "10:15 AM",
    date: "May 22, 2023",
    title: "Mimikatz Detection",
    description: "Wazuh detected suspicious originalFileName associated with Mimikatz",
    severity: "Critical",
    source: "Wazuh",
  },
  {
    id: "event-2",
    time: "09:45 AM",
    date: "May 22, 2023",
    title: "Malicious Hash Identified",
    description: "SHA256 hash sent to VirusTotal and identified as malicious",
    severity: "High",
    source: "VirusTotal",
  },
  {
    id: "event-3",
    time: "09:30 AM",
    date: "May 22, 2023",
    title: "IOC Enrichment",
    description: "Shuffle workflow extracted hash and sent to OpenCTI for enrichment",
    severity: "Medium",
    source: "Shuffle",
  },
  {
    id: "event-4",
    time: "08:30 AM",
    date: "May 22, 2023",
    title: "Multiple Failed Logins",
    description: "Multiple failed login attempts detected from external IP",
    severity: "Medium",
    source: "Wazuh",
  },
  {
    id: "event-5",
    time: "07:15 AM",
    date: "May 22, 2023",
    title: "Suspicious Outbound Connection",
    description: "Connection to known C2 server detected and blocked",
    severity: "High",
    source: "Wazuh",
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

export function ThreatTimeline() {
  return (
    <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
      {timelineEvents.map((event, index) => (
        <div key={event.id} className="relative pl-6">
          {/* Timeline connector */}
          {index < timelineEvents.length - 1 && <div className="absolute left-2.5 top-6 h-full w-0.5 bg-border" />}

          {/* Timeline dot */}
          <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 border-background bg-primary" />

          <Card className="p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                <span className="text-sm font-medium">{event.title}</span>
              </div>
              <Badge variant="outline">{event.source}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {event.time} - {event.date}
            </p>
            <p className="mt-2 text-sm">{event.description}</p>
          </Card>
        </div>
      ))}
    </div>
  )
}
