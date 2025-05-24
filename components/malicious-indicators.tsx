"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ExternalLink, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock indicator data
const mockIPs = [
  {
    value: "192.168.1.254",
    confidence: "High",
    source: "OpenCTI",
    lastSeen: "2023-05-22T10:15:30Z",
    tags: ["C2", "Botnet"],
  },
  {
    value: "10.0.0.1",
    confidence: "Medium",
    source: "VirusTotal",
    lastSeen: "2023-05-21T08:30:45Z",
    tags: ["Scanner"],
  },
  {
    value: "172.16.0.1",
    confidence: "High",
    source: "OpenCTI",
    lastSeen: "2023-05-20T14:22:10Z",
    tags: ["Malware", "Ransomware"],
  },
]

const mockDomains = [
  {
    value: "malicious-domain.com",
    confidence: "High",
    source: "OpenCTI",
    lastSeen: "2023-05-22T09:45:12Z",
    tags: ["Phishing", "Malware"],
  },
  {
    value: "fake-login.net",
    confidence: "High",
    source: "VirusTotal",
    lastSeen: "2023-05-21T11:20:30Z",
    tags: ["Phishing"],
  },
  {
    value: "download-malware.org",
    confidence: "Medium",
    source: "OpenCTI",
    lastSeen: "2023-05-20T16:40:15Z",
    tags: ["Malware"],
  },
]

const mockHashes = [
  {
    value: "5f4dcc3b5aa765d61d8327deb882cf99",
    confidence: "High",
    source: "VirusTotal",
    lastSeen: "2023-05-22T08:10:05Z",
    tags: ["Mimikatz", "Trojan"],
  },
  {
    value: "e10adc3949ba59abbe56e057f20f883e",
    confidence: "Medium",
    source: "OpenCTI",
    lastSeen: "2023-05-21T13:25:40Z",
    tags: ["Backdoor"],
  },
  {
    value: "25f9e794323b453885f5181f1b624d0b",
    confidence: "High",
    source: "VirusTotal",
    lastSeen: "2023-05-20T10:30:22Z",
    tags: ["Ransomware"],
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

function getConfidenceColor(confidence: string) {
  switch (confidence.toLowerCase()) {
    case "high":
      return "bg-red-500 hover:bg-red-600"
    case "medium":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "low":
      return "bg-green-500 hover:bg-green-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

export function MaliciousIndicators() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
      duration: 3000,
    })
  }

  const renderTable = (data: any[]) => {
    const filteredData = data.filter(
      (item) =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">{item.value}</TableCell>
                <TableCell>
                  <Badge className={getConfidenceColor(item.confidence)}>{item.confidence}</Badge>
                </TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{formatDate(item.lastSeen)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(item.value)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View details</span>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by indicator or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="ips">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ips">IP Addresses</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="hashes">File Hashes</TabsTrigger>
        </TabsList>
        <TabsContent value="ips">{renderTable(mockIPs)}</TabsContent>
        <TabsContent value="domains">{renderTable(mockDomains)}</TabsContent>
        <TabsContent value="hashes">{renderTable(mockHashes)}</TabsContent>
      </Tabs>
    </div>
  )
}
