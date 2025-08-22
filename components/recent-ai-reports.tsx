import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Trash2 } from "lucide-react"

// Mock AI-generated reports data
const recentReports = [
  {
    id: "RPT-2023-001",
    title: "Mimikatz Detection Incident Report",
    type: "Incident",
    generated: "2023-05-22T10:30:45Z",
    status: "Complete",
    pages: 5,
  },
  {
    id: "RPT-2023-002",
    title: "Weekly Threat Intelligence Summary",
    type: "Summary",
    generated: "2023-05-21T14:15:30Z",
    status: "Complete",
    pages: 8,
  },
  {
    id: "RPT-2023-003",
    title: "Ransomware Campaign Analysis",
    type: "Threat",
    generated: "2023-05-20T09:45:12Z",
    status: "Complete",
    pages: 12,
  },
  {
    id: "RPT-2023-004",
    title: "Failed Authentication Incident Report",
    type: "Incident",
    generated: "2023-05-19T16:20:30Z",
    status: "Complete",
    pages: 4,
  },
  {
    id: "RPT-2023-005",
    title: "Monthly Security Posture Assessment",
    type: "Summary",
    generated: "2023-05-18T11:10:25Z",
    status: "Complete",
    pages: 15,
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

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "incident":
      return "bg-red-500 hover:bg-red-600"
    case "threat":
      return "bg-orange-500 hover:bg-orange-600"
    case "summary":
      return "bg-blue-500 hover:bg-blue-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export function RecentAIReports() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Generated</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.title}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
              </TableCell>
              <TableCell>{formatDate(report.generated)}</TableCell>
              <TableCell>{report.pages}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
