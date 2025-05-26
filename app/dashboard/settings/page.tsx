"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { Check, Loader2, Server } from "lucide-react"
import { testLocalModelConnection } from "@/services/ai-service"

export default function SettingsPage() {
  const [localAIEndpoint, setLocalAIEndpoint] = useState("http://localhost:8000/generate")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    try {
      const isConnected = await testLocalModelConnection(localAIEndpoint)

      if (isConnected) {
        setConnectionStatus("success")
        toast({
          title: "Connection successful",
          description: "Successfully connected to local Mistral model",
        })
      } else {
        throw new Error("Failed to connect")
      }
    } catch (error) {
      console.error("Error testing connection:", error)
      setConnectionStatus("error")
      toast({
        title: "Connection failed",
        description: "Failed to connect to local AI model. Make sure your backend is running on port 8000.",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or local storage
    localStorage.setItem("local_ai_endpoint", localAIEndpoint)
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    })
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings" description="Configure your SOC dashboard settings" />
      <div className="p-4">
        <Tabs defaultValue="ai">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Local AI Model Configuration</CardTitle>
                <CardDescription>Configure settings for your locally hosted Mistral model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint">Local AI Endpoint</Label>
                  <div className="flex gap-2">
                    <Input
                      id="endpoint"
                      value={localAIEndpoint}
                      onChange={(e) => setLocalAIEndpoint(e.target.value)}
                      placeholder="http://localhost:8000/generate"
                    />
                    <Button
                      variant="outline"
                      onClick={testConnection}
                      disabled={isTestingConnection}
                      className="min-w-[120px]"
                    >
                      {isTestingConnection ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : connectionStatus === "success" ? (
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <Server className="mr-2 h-4 w-4" />
                      )}
                      {isTestingConnection
                        ? "Testing..."
                        : connectionStatus === "success"
                          ? "Connected"
                          : "Test Connection"}
                    </Button>
                  </div>
                  {connectionStatus === "error" && (
                    <p className="text-sm text-destructive">
                      Failed to connect to the local AI model. Make sure your backend is running with:
                      <code className="block mt-1 p-2 bg-muted rounded text-xs">
                        uvicorn backend:app --reload --port 8000
                      </code>
                    </p>
                  )}
                  {connectionStatus === "success" && (
                    <p className="text-sm text-green-600">Successfully connected to Mistral 7B model!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Model Information</Label>
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-medium">Mistral 7B Instruct v0.1</p>
                    <p className="text-xs text-muted-foreground mt-1">Model: mistral-7b-instruct-v0.1.Q5_K_M.gguf</p>
                    <p className="text-xs text-muted-foreground">Context Length: 2048 tokens</p>
                    <p className="text-xs text-muted-foreground">Quantization: Q5_K_M (5.67 BPW)</p>
                  </div>
                </div>

                <Button onClick={saveSettings}>Save AI Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Model Usage Tips</CardTitle>
                <CardDescription>Best practices for using your local Mistral model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Prompt Format:</strong> Your Mistral model uses the [INST] format for instructions.
                  </p>
                  <code className="block p-2 bg-muted rounded text-xs">[INST] Your instruction here [/INST]</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Context Window:</strong> The model has a 2048 token context window. Keep your prompts
                    concise for best results.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Response Time:</strong> Local generation may take 10-30 seconds depending on your hardware.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure connections to external security tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Wazuh API Endpoint</Label>
                    <Input placeholder="https://wazuh.example.com:55000" />
                  </div>
                  <div className="space-y-2">
                    <Label>OpenCTI API Endpoint</Label>
                    <Input placeholder="https://opencti.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Shuffle Webhook URL</Label>
                    <Input placeholder="https://shuffle.example.com/api/v1/hooks/webhook_id" />
                  </div>
                  <div className="space-y-2">
                    <Label>VirusTotal API Key</Label>
                    <Input type="password" placeholder="••••••••••••••••" />
                  </div>
                </div>
                <Button>Save Integration Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value="admin" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value="Administrator" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="admin@example.com" />
                </div>
                <Button>Update Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
