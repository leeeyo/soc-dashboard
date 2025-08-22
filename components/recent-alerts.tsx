'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"

// Utility to get relative time
function getRelativeTime(dateString: string) {
  const now = new Date()
  const then = new Date(dateString)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 60) return `${diff} sec ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
  return then.toLocaleDateString()
}

// Map alert level to severity and color
function getSeverity(level: number) {
  if (level >= 10) return { label: "Critical", color: "bg-red-500" }
  if (level >= 8) return { label: "High", color: "bg-orange-400" }
  if (level >= 5) return { label: "Medium", color: "bg-yellow-400" }
  return { label: "Low", color: "bg-green-500" }
}

// Mock alerts mapped from your JSON
const recentAlerts = [
  {
    _index: "wazuh-alerts-4.x-2025.05.22",
    _id: "iJp5-ZYBFuQzhsMYGCPN",
    _version: 1,
    _score: null,
    _source: {
      input: { type: "log" },
      agent: { ip: "192.168.171.137", name: "PFE", id: "002" },
      manager: { name: "wazuh" },
      data: {
        win: {
          eventdata: {
            originalFileName: "mimikatz.exe",
            image: "C:\\Users\\wazuh\\Downloads\\mimikatz_trunk\\x64\\imnotamalware.exe",
            product: "mimikatz",
            parentProcessGuid: "{57c207e1-68f0-682f-8901-000000001200}",
            description: "mimikatz for Windows",
            logonGuid: "{57c207e1-6835-682f-ad82-0b0000000000}",
            parentCommandLine: "\"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe\"",
            processGuid: "{57c207e1-7b28-682f-b902-000000001200}",
            logonId: "0xb82ad",
            parentProcessId: "420",
            processId: "6008",
            currentDirectory: "C:\\Users\\wazuh\\Downloads\\mimikatz_trunk\\x64\\",
            utcTime: "2025-05-22 19:29:44.988",
            hashes: "MD5=29EFD64DD3C7FE1E2B022B7AD73A1BA5,SHA256=61C0810A23580CF492A6BA4F7654566108331E7A4134C968C2D6A05261B2D8A1,IMPHASH=55EE500BB4BDFC49F27A98AE456D8EDF",
            parentImage: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
            company: "gentilkiwi (Benjamin DELPY)",
            commandLine: "\"C:\\Users\\wazuh\\Downloads\\mimikatz_trunk\\x64\\imnotamalware.exe\"",
            integrityLevel: "Medium",
            fileVersion: "2.2.0.0",
            user: "DESKTOP-G9CNB5T\\wazuh",
            terminalSessionId: "1",
            parentUser: "DESKTOP-G9CNB5T\\wazuh",
          },
          system: {
            eventID: "1",
            keywords: "0x8000000000000000",
            providerGuid: "{5770385f-c22a-43e0-bf4c-06f5698ffbd9}",
            level: "4",
            channel: "Microsoft-Windows-Sysmon/Operational",
            opcode: "0",
            version: "5",
            systemTime: "2025-05-22T19:29:44.9900683Z",
            eventRecordID: "26510",
            threadID: "4184",
            computer: "DESKTOP-G9CNB5T",
            task: "1",
            processID: "3124",
            severityValue: "INFORMATION",
            providerName: "Microsoft-Windows-Sysmon",
          },
        },
      },
      rule: {
        firedtimes: 1,
        mail: false,
        level: 10,
        description: "Mimikatz Usage Detected",
        groups: ["local", "syslog", "sshd"],
        mitre: { technique: ["OS Credential Dumping"], id: ["T1003"], tactic: ["Credential Access"] },
        id: "199999",
      },
      location: "EventChannel",
      decoder: { name: "windows_eventchannel" },
      id: "1747942184.8723052",
      timestamp: "2025-05-22T19:29:44.436+0000",
    },
    fields: { timestamp: ["2025-05-22T19:29:44.436Z"] },
    sort: [1747942184436],
  },
  {
    _index: "wazuh-alerts-4.x-2025.05.24",
    _id: "sdy9_5YB71InDEATBM_R",
    _version: 1,
    _score: null,
    _source: {
      input: { type: "log" },
      agent: { ip: "192.168.171.137", name: "PFE", id: "002" },
      manager: { name: "wazuh" },
      data: {
        win: {
          eventdata: {
            image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
            processGuid: "{57c207e1-15c1-6831-cd01-000000001400}",
            processId: "3028",
            utcTime: "2025-05-24 00:41:37.225",
            targetFilename: "C:\\Users\\wazuh\\AppData\\Local\\Temp\\__PSScriptPolicyTest_0zvxnshl.osm.ps1",
            creationUtcTime: "2025-05-24 00:41:37.225",
            user: "DESKTOP-G9CNB5T\\wazuh",
          },
          system: {
            eventID: "11",
            keywords: "0x8000000000000000",
            providerGuid: "{5770385f-c22a-43e0-bf4c-06f5698ffbd9}",
            level: "4",
            channel: "Microsoft-Windows-Sysmon/Operational",
            opcode: "0",
            message: "\"File created:\\r\\nRuleName: -\\r\\nUtcTime: 2025-05-24 00:41:37.225\\r\\nProcessGuid: {57c207e1-15c1-6831-cd01-000000001400}\\r\\nProcessId: 3028\\r\\nImage: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe\\r\\nTargetFilename: C:\\Users\\wazuh\\AppData\\Local\\Temp\\__PSScriptPolicyTest_0zvxnshl.osm.ps1\\r\\nCreationUtcTime: 2025-05-24 00:41:37.225\\r\\nUser: DESKTOP-G9CNB5T\\wazuh\"",
            version: "2",
            systemTime: "2025-05-24T00:41:37.2391088Z",
            eventRecordID: "28154",
            threadID: "3220",
            computer: "DESKTOP-G9CNB5T",
            task: "11",
            processID: "3316",
            severityValue: "INFORMATION",
            providerName: "Microsoft-Windows-Sysmon",
          },
        },
      },
      rule: {
        firedtimes: 3,
        mail: false,
        level: 8,
        description: "Executable file dropped in folder commonly used by malware.",
        groups: ["rule_exclusion"],
        id: "900030",
      },
      location: "EventChannel",
      decoder: { name: "windows_eventchannel" },
      id: "1748047297.1702318",
      timestamp: "2025-05-24T00:41:37.756+0000",
    },
    fields: { timestamp: ["2025-05-24T00:41:37.756Z"] },
    sort: [1748047297756],
  },
]

export function RecentAlerts() {
  const [openAlert, setOpenAlert] = useState<typeof recentAlerts[0] | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {recentAlerts.map((alert) => {
        const severity = getSeverity(alert._source.rule.level)
        return (
          <div
            key={alert._id}
            className="flex items-center justify-between rounded-lg bg-black px-6 py-4 shadow-sm border border-neutral-800"
          >
            <div className="flex items-center gap-4">
              <span className={`h-3 w-3 rounded-full ${severity.color}`}></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-white">{alert._source.rule.description}</span>
                  <span className={`text-xs font-medium ${severity.color} ml-2`}>{severity.label}</span>
                </div>
                <div className="text-xs text-gray-400 flex gap-2 mt-1">
                  <span>Source: {alert._source.agent.name || alert._source.manager.name}</span>
                  <span>·</span>
                  <span>{getRelativeTime(alert._source.timestamp)}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpenAlert(alert)}>
              View <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
          </div>
        )
      })}

      {openAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-2xl h-[80vh] overflow-y-auto relative border border-neutral-700 text-sm text-gray-300">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white z-10" onClick={() => setOpenAlert(null)}>
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-white mb-4">Alert Details</h2>

            <div className="flex items-center gap-2 mb-4">
              <span className={`h-3 w-3 rounded-full ${getSeverity(openAlert._source.rule.level).color}`}></span>
              <span className="font-semibold text-base text-white">{openAlert._source.rule.description}</span>
              <span className={`text-xs font-medium ${getSeverity(openAlert._source.rule.level).color} ml-2`}>{getSeverity(openAlert._source.rule.level).label}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-white mb-2">General Info</h3>
                <p><span className="font-medium">Alert ID:</span> {openAlert._id}</p>
                <p><span className="font-medium">Timestamp:</span> {openAlert._source.timestamp}</p>
                <p><span className="font-medium">Source:</span> {openAlert._source.agent.name || openAlert._source.manager.name}</p>
                <p><span className="font-medium">Location:</span> {openAlert._source.location}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Rule Details</h3>
                <p><span className="font-medium">Rule ID:</span> {openAlert._source.rule.id}</p>
                <p><span className="font-medium">Rule Level:</span> {openAlert._source.rule.level}</p>
                <p><span className="font-medium">Fired Times:</span> {openAlert._source.rule.firedtimes}</p>
                {openAlert._source.rule.mitre && (
                  <p><span className="font-medium">MITRE ATT&CK:</span> {openAlert._source.rule.mitre.technique.join(', ')} ({openAlert._source.rule.mitre.id.join(', ')})</p>
                )}
                 <p><span className="font-medium">Groups:</span> {openAlert._source.rule.groups.join(', ')}</p>
              </div>
            </div>

            {openAlert._source.data?.win && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                  <h3 className="font-semibold text-white mb-2">System Data</h3>
                  {openAlert._source.data.win.system.eventID && <p><span className="font-medium">Event ID:</span> {openAlert._source.data.win.system.eventID}</p>}
                  {openAlert._source.data.win.system.computer && <p><span className="font-medium">Computer:</span> {openAlert._source.data.win.system.computer}</p>}
                   {openAlert._source.data.win.system.providerName && <p><span className="font-medium">Provider:</span> {openAlert._source.data.win.system.providerName}</p>}
                   {openAlert._source.data.win.system.channel && <p><span className="font-medium">Channel:</span> {openAlert._source.data.win.system.channel}</p>}
                   {openAlert._source.data.win.system.severityValue && <p><span className="font-medium">System Severity:</span> {openAlert._source.data.win.system.severityValue}</p>}
                  {openAlert._source.data.win.system.processID && <p><span className="font-medium">System Process ID:</span> {openAlert._source.data.win.system.processID}</p>}
                   {openAlert._source.data.win.system.threadID && <p><span className="font-medium">Thread ID:</span> {openAlert._source.data.win.system.threadID}</p>}
                   {openAlert._source.data.win.system.task && <p><span className="font-medium">Task:</span> {openAlert._source.data.win.system.task}</p>}
                   {openAlert._source.data.win.system.message && (
                    <div className="mt-2">
                      <span className="font-medium">System Message:</span>
                      <pre className="whitespace-pre-wrap break-words bg-neutral-800 p-2 rounded mt-1 text-xs">{openAlert._source.data.win.system.message}</pre>
                    </div>
                   )}
                </div>

                 <div>
                  <h3 className="font-semibold text-white mb-2">Event Data</h3>
                  {openAlert._source.data.win.eventdata.user && <p><span className="font-medium">User:</span> {openAlert._source.data.win.eventdata.user}</p>}
                   {openAlert._source.data.win.eventdata.image && <p><span className="font-medium">Image:</span> {openAlert._source.data.win.eventdata.image}</p>}
                   {openAlert._source.data.win.eventdata.commandLine && (
                    <div className="mt-2">
                      <span className="font-medium">Command Line:</span>
                      <pre className="whitespace-pre-wrap break-words bg-neutral-800 p-2 rounded mt-1 text-xs">{openAlert._source.data.win.eventdata.commandLine}</pre>
                    </div>
                   )}
                   {openAlert._source.data.win.eventdata.processId && <p><span className="font-medium">Process ID:</span> {openAlert._source.data.win.eventdata.processId}</p>}
                  {openAlert._source.data.win.eventdata.processGuid && <p><span className="font-medium">Process GUID:</span> {openAlert._source.data.win.eventdata.processGuid}</p>}
                   {openAlert._source.data.win.eventdata.parentProcessId && <p><span className="font-medium">Parent Process ID:</span> {openAlert._source.data.win.eventdata.parentProcessId}</p>}
                  {openAlert._source.data.win.eventdata.parentProcessGuid && <p><span className="font-medium">Parent Process GUID:</span> {openAlert._source.data.win.eventdata.parentProcessGuid}</p>}
                   {openAlert._source.data.win.eventdata.originalFileName && <p><span className="font-medium">Original Filename:</span> {openAlert._source.data.win.eventdata.originalFileName}</p>}
                  {openAlert._source.data.win.eventdata.targetFilename && <p><span className="font-medium">Target Filename:</span> {openAlert._source.data.win.eventdata.targetFilename}</p>}
                   {openAlert._source.data.win.eventdata.hashes && <p><span className="font-medium">Hashes:</span> {openAlert._source.data.win.eventdata.hashes}</p>}
                   {openAlert._source.data.win.eventdata.product && <p><span className="font-medium">Product:</span> {openAlert._source.data.win.eventdata.product}</p>}
                  {openAlert._source.data.win.eventdata.company && <p><span className="font-medium">Company:</span> {openAlert._source.data.win.eventdata.company}</p>}
                   {openAlert._source.data.win.eventdata.fileVersion && <p><span className="font-medium">File Version:</span> {openAlert._source.data.win.eventdata.fileVersion}</p>}
                   {openAlert._source.data.win.eventdata.currentDirectory && <p><span className="font-medium">Current Directory:</span> {openAlert._source.data.win.eventdata.currentDirectory}</p>}
                   {openAlert._source.data.win.eventdata.logonGuid && <p><span className="font-medium">Logon GUID:</span> {openAlert._source.data.win.eventdata.logonGuid}</p>}
                   {openAlert._source.data.win.eventdata.logonId && <p><span className="font-medium">Logon ID:</span> {openAlert._source.data.win.eventdata.logonId}</p>}
                   {openAlert._source.data.win.eventdata.terminalSessionId && <p><span className="font-medium">Terminal Session ID:</span> {openAlert._source.data.win.eventdata.terminalSessionId}</p>}
                   {openAlert._source.data.win.eventdata.integrityLevel && <p><span className="font-medium">Integrity Level:</span> {openAlert._source.data.win.eventdata.integrityLevel}</p>}
                   {openAlert._source.data.win.eventdata.utcTime && <p><span className="font-medium">Event UTC Time:</span> {openAlert._source.data.win.eventdata.utcTime}</p>}
                   {openAlert._source.data.win.eventdata.creationUtcTime && <p><span className="font-medium">Creation UTC Time:</span> {openAlert._source.data.win.eventdata.creationUtcTime}</p>}
                   {openAlert._source.data.win.eventdata.parentUser && <p><span className="font-medium">Parent User:</span> {openAlert._source.data.win.eventdata.parentUser}</p>}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
