"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Search } from "lucide-react"

// Mock incident data
const incidents = [
  {
    id: "INC-2023-001",
    title: "Mimikatz Detection - Credential Theft Attempt",
    severity: "Critical",
    status: "Active",
    assignee: "John Doe",
    created: "2023-05-22T10:15:30Z",
    updated: "2023-05-22T11:30:45Z",
    source: "Wazuh",
    relatedIOCs: 3,
  },
  {
    id: "INC-2023-002",
    title: "Suspicious Outbound Connection to Known C2",
    severity: "High",
    status: "Investigating",
    assignee: "Jane Smith",
    created: "2023-05-22T09:45:12Z",
    updated: "2023-05-22T10:20:30Z",
    source: "OpenCTI",
    relatedIOCs: 2,
  },
  {
    id: "INC-2023-003",
    title: "Multiple Failed Authentication Attempts",
    severity: "Medium",
    status: "Active",
    assignee: "Unassigned",
    created: "2023-05-22T08:30:45Z",
    updated: "2023-05-22T09:15:10Z",
    source: "Wazuh",
    relatedIOCs: 1,
  },
  {
    id: "INC-2023-004",
    title: "Ransomware IOCs Detected on Endpoint",
    severity: "Critical",
    status: "Investigating",
    assignee: "Mike Johnson",
    created: "2023-05-22T07:15:22Z",
    updated: "2023-05-22T08:45:30Z",
    source: "VirusTotal",
    relatedIOCs: 5,
  },
  {
    id: "INC-2023-005",
    title: "Unusual Admin Activity After Hours",
    severity: "Medium",
    status: "Active",
    assignee: "Sarah Williams",
    created: "2023-05-22T06:50:18Z",
    updated: "2023-05-22T07:30:25Z",
    source: "Wazuh",
    relatedIOCs: 0,
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
    case "active":
      return "border-red-500 text-red-500"
    case "investigating":
      return "border-orange-500 text-orange-500"
    case "resolved":
      return "border-green-500 text-green-500"
    default:
      return "border-blue-500 text-blue-500"
  }
}

export function IncidentsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.assignee.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleIncident = (id: string) => {
    setSelectedIncidents((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (selectedIncidents.length === filteredIncidents.length) {
      setSelectedIncidents([])
    } else {
      setSelectedIncidents(filteredIncidents.map((incident) => incident.id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {selectedIncidents.length > 0 && (
            <span className="text-sm text-muted-foreground">{selectedIncidents.length} selected</span>
          )}
          <Button variant="outline" size="sm" disabled={selectedIncidents.length === 0}>
            Assign
          </Button>
          <Button variant="outline" size="sm" disabled={selectedIncidents.length === 0}>
            Change Status
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIncidents.length === filteredIncidents.length && filteredIncidents.length > 0}
                  onCheckedChange={toggleAll}
                  aria-label="Select all incidents"
                />
              </TableHead>
              <TableHead>Incident</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>IOCs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIncidents.includes(incident.id)}
                    onCheckedChange={() => toggleIncident(incident.id)}
                    aria-label={`Select incident ${incident.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{incident.title}</div>
                  <div className="text-xs text-muted-foreground">{incident.id}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell>{incident.assignee}</TableCell>
                <TableCell>{formatDate(incident.created)}</TableCell>
                <TableCell>{incident.source}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{incident.relatedIOCs}</Badge>
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
    </div>
  )
}
