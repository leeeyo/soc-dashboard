"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"

function getRelativeTime(dateString: string) {
  const now = new Date()
  const then = new Date(dateString)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 60) return `${diff} sec ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
  return then.toLocaleDateString()
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-500"
    case "high":
      return "bg-orange-400"
    case "medium":
      return "bg-yellow-400"
    case "low":
      return "bg-green-500"
    default:
      return "bg-blue-500"
  }
}

// Mock incident data with nested structure
const incidents = [
  {
    _id: "INC-2023-001",
    _source: {
      id: "INC-2023-001",
      title: "Mimikatz Detection - Credential Theft Attempt",
      severity: "Critical",
      status: "Active",
      created: "2023-05-22T10:15:30Z",
      updated: "2023-05-22T11:30:45Z",
      source: "Wazuh",
      relatedIOCs: 3,
    },
  },
  {
    _id: "INC-2023-003",
    _source: {
      id: "INC-2023-003",
      title: "Multiple Failed Authentication Attempts",
      severity: "Medium",
      status: "Active",
      created: "2023-05-22T08:30:45Z",
      updated: "2023-05-22T09:15:10Z",
      source: "Wazuh",
      relatedIOCs: 1,
    },
  },
  {
    _id: "INC-2023-005",
    _source: {
      id: "INC-2023-005",
      title: "Suspicious PowerShell Script Execution",
      severity: "High",
      status: "Active",
      created: "2023-05-22T06:50:18Z",
      updated: "2023-05-22T07:30:25Z",
      source: "Wazuh",
      relatedIOCs: 0,
    },
  },
]

export function IncidentsList() {
  const [openIncident, setOpenIncident] = useState<typeof incidents[0] | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {incidents.map((incident) => {
        const sevColor = getSeverityColor(incident._source.severity)
        return (
          <div
            key={incident._id}
            className="flex items-center justify-between rounded-lg bg-black px-6 py-4 shadow-sm border border-neutral-800"
          >
            <div className="flex items-center gap-4">
              <span className={`h-3 w-3 rounded-full ${sevColor}`}></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-white">{incident._source.title}</span>
                  <span className={`text-xs font-medium ${sevColor} ml-2`}>{incident._source.severity}</span>
                </div>
                <div className="text-xs text-gray-400 flex gap-2 mt-1">
                  <span>Source: {incident._source.source}</span>
                  <span>·</span>
                  <span>{getRelativeTime(incident._source.created)}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpenIncident(incident)}>
              View <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      })}
      {openIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-2xl h-[80vh] overflow-y-auto relative border border-neutral-700 text-sm text-gray-300">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white z-10" onClick={() => setOpenIncident(null)}>
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-white mb-4">Incident Details</h2>

            <div className="flex items-center gap-2 mb-4">
              <span className={`h-3 w-3 rounded-full ${getSeverityColor(openIncident._source.severity)}`}></span>
              <span className="font-semibold text-base text-white">{openIncident._source.title}</span>
              <span className={`text-xs font-medium ${getSeverityColor(openIncident._source.severity)} ml-2`}>{openIncident._source.severity}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-white mb-2">General Info</h3>
                <p><span className="font-medium">Incident ID:</span> {openIncident._id}</p>
                <p><span className="font-medium">Created:</span> {openIncident._source.created}</p>
                <p><span className="font-medium">Updated:</span> {openIncident._source.updated}</p>
                <p><span className="font-medium">Source:</span> {openIncident._source.source}</p>
                <p><span className="font-medium">Status:</span> {openIncident._source.status}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Related Information</h3>
                <p><span className="font-medium">Related IOCs:</span> {openIncident._source.relatedIOCs}</p>
                {/* Add other relevant incident-specific fields here if available in data */}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
