import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"

// Mock alert data
const recentAlerts = [
  {
    id: "ALT-1234",
    timestamp: "2023-05-22T10:15:30Z",
    severity: "Critical",
    source: "Wazuh",
    description: "Mimikatz detection - Suspicious originalFileName",
    status: "Open",
  },
  {
    id: "ALT-1233",
    timestamp: "2023-05-22T09:45:12Z",
    severity: "High",
    source: "OpenCTI",
    description: "Malicious hash detected in VirusTotal",
    status: "Investigating",
  },
  {
    id: "ALT-1232",
    timestamp: "2023-05-22T08:30:45Z",
    severity: "Medium",
    source: "Wazuh",
    description: "Multiple failed login attempts",
    status: "Closed",
  },
  {
    id: "ALT-1231",
    timestamp: "2023-05-22T07:15:22Z",
    severity: "High",
    source: "Shuffle",
    description: "Suspicious outbound connection to known C2",
    status: "Open",
  },
  {
    id: "ALT-1230",
    timestamp: "2023-05-22T06:50:18Z",
    severity: "Low",
    source: "Wazuh",
    description: "Unusual file system activity",
    status: "Closed",
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

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

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "border-red-500 text-red-500"
    case "investigating":
      return "border-orange-500 text-orange-500"
    case "closed":
      return "border-green-500 text-green-500"
    default:
      return "border-blue-500 text-blue-500"
  }
}

export function RecentAlerts() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.id}</TableCell>
              <TableCell>{formatDate(alert.timestamp)}</TableCell>
              <TableCell>
                <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
              </TableCell>
              <TableCell>{alert.source}</TableCell>
              <TableCell className="max-w-[300px] truncate">{alert.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(alert.status)}>
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
