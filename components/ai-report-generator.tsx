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
import { Loader2, Sparkles, AlertTriangle, FileText, MessageSquare } from "lucide-react"
import { generateTextWithLocalModel, getModelParameters, reportTemplates } from "@/services/ai-service"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import jsPDF from 'jspdf'

export function AIReportGenerator() {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("incident")
  const [reportOutput, setReportOutput] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(128)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const MAX_PROMPT_LENGTH = 1000
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    setLoading(true)
    setReportOutput("")
    setError(null)
    setDebugInfo(null)

    try {
      let prompt = ""
      if (useCustomPrompt) {
        prompt = customPrompt
      } else {
        // Get the prompt template based on report type
        const template = reportTemplates[reportType as keyof typeof reportTemplates]
        prompt = template.prompt(additionalContext)
      }

      // Hardcode to use local-mistral
      const selectedModelId = "local-mistral"
      const selectedModelObj = { id: "local-mistral", name: "Mistral 7B (Local)", type: "local", endpoint: "...", description: "..." }
      
      setDebugInfo(`Using model: ${selectedModelObj?.name}, type: ${selectedModelObj?.type}
Parameters: temperature=${temperature}, max_tokens=${maxTokens}`)

      let text = ""

      // Only use local model generation
      toast({
        title: "Generating report",
        description: "Using local Mistral model...",
      })

      setDebugInfo((prev) => `${prev}\nSending request to local model...`)

      try {
        const result = await generateTextWithLocalModel(selectedModelId, prompt, {
          temperature,
          maxTokens,
        })
        text = result.text
        setDebugInfo((prev) => `${prev}\nReceived response of length: ${text.length}`)
      } catch (err: any) {
        setDebugInfo((prev) => `${prev}\nError: ${err.message || "Unknown error"}`)
        throw err
      }

      setReportOutput(text)

      // Save to report history
      const reportHistory = JSON.parse(localStorage.getItem("report_history") || "[]")
      reportHistory.unshift({
        id: `RPT-${Date.now()}`,
        title: useCustomPrompt ? "Custom Prompt Report" : `${reportType} Report`,
        type: useCustomPrompt ? "custom" : reportType,
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

  const saveReportAsTxt = () => {
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
      description: "Your report has been saved to your device as TXT",
    })
  }

  const saveReportAsPdf = () => {
    if (!reportOutput) return

    try {
      // Create new PDF document
      const doc = new jsPDF()
      
      // Set font styles
      doc.setFont("helvetica", "normal")
      doc.setFontSize(16)
      
      // Add title
      const title = useCustomPrompt ? "Custom Prompt Report" : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`
      doc.text(title, 20, 20)
      
      // Add generation date
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30)
      
      // Add separator line
      doc.setDrawColor(200)
      doc.line(20, 35, 190, 35)
      
      // Add report content
      doc.setFontSize(12)
      doc.setTextColor(0)
      
      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(reportOutput, 170)
      
      // Add text with proper spacing
      doc.text(splitText, 20, 45)
      
      // Save the PDF
      doc.save(`soc-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`)

      toast({
        title: "PDF saved",
        description: "Your report has been saved as a PDF file",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error saving PDF",
        description: "There was an error generating the PDF file",
        variant: "destructive",
      })
    }
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

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="custom-prompt">Use Custom Prompt</Label>
          <Switch
            id="custom-prompt"
            checked={useCustomPrompt}
            onCheckedChange={setUseCustomPrompt}
          />
        </div>

        {!useCustomPrompt ? (
          <>
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
              <Label>Additional Context (Optional)</Label>
              <Textarea
                placeholder="Add any specific details or context for the AI to consider..."
                className="min-h-[100px]"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Custom Prompt</Label>
              <span className="text-sm text-muted-foreground">
                {customPrompt.length}/{MAX_PROMPT_LENGTH} characters
              </span>
            </div>
            <Textarea
              placeholder="Enter your custom prompt here..."
              className="min-h-[200px] font-mono"
              value={customPrompt}
              onChange={(e) => {
                if (e.target.value.length <= MAX_PROMPT_LENGTH) {
                  setCustomPrompt(e.target.value)
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Write a detailed prompt for the AI to generate your report. Be specific about what you want to include.
            </p>
          </div>
        )}

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
              <Button variant="outline" size="sm" onClick={saveReportAsTxt}>
                <FileText className="mr-2 h-3 w-3" />
                Save as TXT
              </Button>
              <Button variant="outline" size="sm" onClick={saveReportAsPdf}>
                <FileText className="mr-2 h-3 w-3" />
                Save as PDF
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
