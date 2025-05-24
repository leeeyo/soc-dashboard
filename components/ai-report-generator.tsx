"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Loader2, Sparkles, AlertTriangle, Save } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { availableModels, generateTextWithLocalModel, getModelParameters, reportTemplates } from "@/services/ai-service"
import { useToast } from "@/hooks/use-toast"

export function AIReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("incident")
  const [selectedModel, setSelectedModel] = useState("local-mistral")
  const [reportOutput, setReportOutput] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(128) // Reduced default max tokens
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { toast } = useToast()

  // Update model parameters when model changes
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    const params = getModelParameters(modelId)
    setMaxTokens(params.maxTokens)
    setTemperature(params.temperature)
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    setReportOutput("")
    setError(null)
    setDebugInfo(null)

    try {
      // Get the prompt template based on report type
      const template = reportTemplates[reportType as keyof typeof reportTemplates]
      const prompt = template.prompt(additionalContext)

      const selectedModelObj = availableModels.find((m) => m.id === selectedModel)
      setDebugInfo(`Using model: ${selectedModelObj?.name}, type: ${selectedModelObj?.type}
Parameters: temperature=${temperature}, max_tokens=${maxTokens}`)

      let text = ""

      if (selectedModelObj?.type === "local") {
        // Use local model
        toast({
          title: "Generating report",
          description: "Using local Mistral model...",
        })

        setDebugInfo((prev) => `${prev}\nSending request to: ${selectedModelObj.endpoint}`)

        try {
          const result = await generateTextWithLocalModel(selectedModel, prompt, {
            temperature,
            maxTokens,
          })
          text = result.text
          setDebugInfo((prev) => `${prev}\nReceived response of length: ${text.length}`)
        } catch (err: any) {
          setDebugInfo((prev) => `${prev}\nError: ${err.message || "Unknown error"}`)
          throw err
        }
      } else {
        // Use OpenAI model
        const result = await generateText({
          model: openai(selectedModel),
          prompt,
          temperature,
          maxTokens,
          system:
            "You are a cybersecurity expert specializing in threat intelligence and incident reporting. Generate detailed, professional security reports.",
        })
        text = result.text
      }

      setReportOutput(text)

      // Save to report history
      const reportHistory = JSON.parse(localStorage.getItem("report_history") || "[]")
      reportHistory.unshift({
        id: `RPT-${Date.now()}`,
        title: `${template.title}: ${new Date().toLocaleDateString()}`,
        type: reportType,
        generated: new Date().toISOString(),
        content: text,
      })
      localStorage.setItem("report_history", JSON.stringify(reportHistory.slice(0, 10)))

      toast({
        title: "Report generated",
        description: "Your AI report has been generated successfully",
      })
    } catch (error: any) {
      console.error("Error generating report:", error)
      setError(error.message || "Unknown error occurred")
      toast({
        title: "Error generating report",
        description: "Please check your AI model connection and try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // For testing - generate a very simple prompt
  const handleSimpleTest = async () => {
    setLoading(true)
    setReportOutput("")
    setError(null)
    setDebugInfo("Running simple test with minimal prompt...")

    try {
      const selectedModelObj = availableModels.find((m) => m.id === selectedModel)

      if (selectedModelObj?.type === "local") {
        const result = await generateTextWithLocalModel(
          selectedModel,
          "Write a one-sentence description of cybersecurity.",
          {
            temperature: 0.7,
            maxTokens: 64, // Very small token count for quick response
          },
        )

        setReportOutput(result.text)
        setDebugInfo((prev) => `${prev}\nTest completed successfully with response length: ${result.text.length}`)

        toast({
          title: "Test completed",
          description: "Simple test completed successfully",
        })
      } else {
        // Use OpenAI model for test
        const result = await generateText({
          model: openai(selectedModel),
          prompt: "Write a one-sentence description of cybersecurity.",
          temperature: 0.7,
          maxTokens: 64,
        })
        setReportOutput(result.text)
      }
    } catch (error: any) {
      console.error("Error in simple test:", error)
      setError(error.message || "Unknown error in simple test")
      setDebugInfo((prev) => `${prev}\nTest failed: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const saveReport = () => {
    if (!reportOutput) return

    const blob = new Blob([reportOutput], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `soc-report-${reportType}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Report saved",
      description: "Your report has been saved to your device",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert>
            <AlertTitle>Debug Information</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap font-mono text-xs">{debugInfo}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>AI Model</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.type === "local" ? "🖥️ Local" : "☁️ Cloud"} - {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Report Type</Label>
          <RadioGroup value={reportType} onValueChange={setReportType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="incident" id="incident" />
              <Label htmlFor="incident">Incident Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="threat" id="threat" />
              <Label htmlFor="threat">Threat Intelligence Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="summary" id="summary" />
              <Label htmlFor="summary">Executive Summary</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Time Period</Label>
          <Select defaultValue="24h">
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Advanced Settings</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8 px-2 text-xs"
            >
              {showAdvanced ? "Hide" : "Show"}
            </Button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature: {temperature.toFixed(1)}</Label>
                </div>
                <Slider
                  value={[temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values produce more focused, deterministic outputs. Higher values produce more creative, varied
                  outputs.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Max Tokens: {maxTokens}</Label>
                </div>
                <Slider
                  value={[maxTokens]}
                  min={64}
                  max={512}
                  step={32}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the maximum length of the generated report. Higher values may increase generation time.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Additional Context (Optional)</Label>
          <Textarea
            placeholder="Add any specific details or context for the AI to consider..."
            className="min-h-[100px]"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerateReport} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Report
              </>
            )}
          </Button>

          <Button onClick={handleSimpleTest} variant="outline" disabled={loading}>
            Simple Test
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Generated Report</Label>
          {reportOutput && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(reportOutput)
                  toast({
                    title: "Copied to clipboard",
                    description: "Report has been copied to your clipboard",
                  })
                }}
              >
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={saveReport}>
                <Save className="mr-2 h-3 w-3" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Card className="h-[500px] overflow-auto p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reportOutput ? (
            <div className="space-y-4 whitespace-pre-wrap text-sm font-mono">{reportOutput}</div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <Sparkles className="mb-2 h-10 w-10" />
              <p>Your AI-generated report will appear here</p>
              <p className="text-xs">Configure the options and click "Generate AI Report"</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
