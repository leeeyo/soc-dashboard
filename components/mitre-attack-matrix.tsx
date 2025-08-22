"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock MITRE ATT&CK data
const mitreCategories = ["Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion"]

const mitreTechniques = {
  "Initial Access": [
    { id: "T1566", name: "Phishing", count: 12 },
    { id: "T1190", name: "Exploit Public-Facing Application", count: 5 },
    { id: "T1133", name: "External Remote Services", count: 3 },
  ],
  Execution: [
    { id: "T1059", name: "Command and Scripting Interpreter", count: 8 },
    { id: "T1204", name: "User Execution", count: 15 },
    { id: "T1047", name: "Windows Management Instrumentation", count: 4 },
  ],
  Persistence: [
    { id: "T1098", name: "Account Manipulation", count: 6 },
    { id: "T1547", name: "Boot or Logon Autostart Execution", count: 9 },
    { id: "T1136", name: "Create Account", count: 2 },
  ],
  "Privilege Escalation": [
    { id: "T1548", name: "Abuse Elevation Control Mechanism", count: 7 },
    { id: "T1134", name: "Access Token Manipulation", count: 3 },
    { id: "T1484", name: "Domain Policy Modification", count: 1 },
  ],
  "Defense Evasion": [
    { id: "T1562", name: "Impair Defenses", count: 11 },
    { id: "T1070", name: "Indicator Removal", count: 8 },
    { id: "T1036", name: "Masquerading", count: 5 },
  ],
}

export function MitreAttackMatrix() {
  const [selectedCategory, setSelectedCategory] = useState("Initial Access")

  return (
    <div className="space-y-4">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {mitreCategories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {mitreCategories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-2">
              {mitreTechniques[category as keyof typeof mitreTechniques].map((technique) => (
                <Card key={technique.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{technique.id}</Badge>
                      <span className="font-medium">{technique.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              <Info className="h-3 w-3" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">{technique.count} alerts associated with this technique</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{technique.count}</Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
