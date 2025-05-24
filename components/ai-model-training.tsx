"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Check, Clock, Database, Loader2, Upload } from "lucide-react"

export function AIModelTraining() {
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)

  const startTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  return (
    <Tabs defaultValue="training">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="training">Model Training</TabsTrigger>
        <TabsTrigger value="data">Training Data</TabsTrigger>
        <TabsTrigger value="models">Saved Models</TabsTrigger>
      </TabsList>

      <TabsContent value="training" className="space-y-4 pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Base Model</Label>
              <Select defaultValue="gpt4">
                <SelectTrigger>
                  <SelectValue placeholder="Select base model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4o</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Training Dataset</Label>
              <Select defaultValue="incidents">
                <SelectTrigger>
                  <SelectValue placeholder="Select training dataset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incidents">SOC Incident Reports</SelectItem>
                  <SelectItem value="threats">Threat Intelligence Reports</SelectItem>
                  <SelectItem value="combined">Combined Dataset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Training Parameters</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Learning Rate</Label>
                  <Input type="number" defaultValue="0.0001" step="0.00001" min="0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Epochs</Label>
                  <Input type="number" defaultValue="3" min="1" max="10" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input placeholder="Enter a name for your trained model" defaultValue="SOC-Report-Generator-v1" />
            </div>

            <Button onClick={startTraining} disabled={isTraining} className="w-full">
              {isTraining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Training in Progress...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Start Training
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Training Status</Label>
            <Card className="h-[300px] overflow-hidden">
              {isTraining || trainingProgress > 0 ? (
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {trainingProgress < 100 ? "Training in Progress" : "Training Complete"}
                        </span>
                        <span className="text-sm text-muted-foreground">{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Training Steps:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          {trainingProgress >= 20 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={trainingProgress >= 20 ? "" : "text-muted-foreground"}>
                            Preparing dataset
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {trainingProgress >= 40 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={trainingProgress >= 40 ? "" : "text-muted-foreground"}>
                            Fine-tuning base model
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {trainingProgress >= 70 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={trainingProgress >= 70 ? "" : "text-muted-foreground"}>
                            Optimizing model parameters
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {trainingProgress >= 90 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={trainingProgress >= 90 ? "" : "text-muted-foreground"}>
                            Validating model performance
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {trainingProgress >= 100 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={trainingProgress >= 100 ? "" : "text-muted-foreground"}>
                            Saving trained model
                          </span>
                        </li>
                      </ul>
                    </div>

                    {trainingProgress >= 100 && (
                      <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-500">
                        Training completed successfully! Your model is ready to use.
                      </div>
                    )}
                  </div>
                </CardContent>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <Brain className="mb-2 h-10 w-10" />
                  <p>No active training session</p>
                  <p className="text-xs">Configure training parameters and click "Start Training"</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="data" className="space-y-4 pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Available Datasets</Label>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-3 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span>SOC Incident Reports</span>
                  </div>
                  <Badge variant="outline">250 samples</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-orange-500" />
                    <span>Threat Intelligence Reports</span>
                  </div>
                  <Badge variant="outline">180 samples</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span>Combined Dataset</span>
                  </div>
                  <Badge variant="outline">430 samples</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload New Dataset</Label>
              <Card className="p-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag and drop files here</p>
                    <p className="text-xs text-muted-foreground">Supports CSV, JSON, or TXT files</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dataset Statistics</Label>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Samples</p>
                      <p className="text-2xl font-bold">430</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Data Quality</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg. Sample Length</p>
                      <p className="text-2xl font-bold">1,250</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-2xl font-bold">2d ago</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Data Distribution</p>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="flex h-full">
                        <div className="h-full w-[58%] bg-blue-500" />
                        <div className="h-full w-[42%] bg-orange-500" />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Incident Reports (58%)</span>
                      <span>Threat Intel (42%)</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Data Preprocessing</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Clean Data
                </Button>
                <Button variant="outline" className="flex-1">
                  Augment Data
                </Button>
                <Button variant="outline" className="flex-1">
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="models" className="space-y-4 pt-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Base Model</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SOC-Report-Generator-v1</TableCell>
                <TableCell>GPT-4o</TableCell>
                <TableCell>May 20, 2023</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="h-2 w-16" />
                    <span className="text-xs">92%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Use Model
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Threat-Intel-Analyzer</TableCell>
                <TableCell>GPT-3.5 Turbo</TableCell>
                <TableCell>May 15, 2023</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="h-2 w-16" />
                    <span className="text-xs">85%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Inactive</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Use Model
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Executive-Summary-Generator</TableCell>
                <TableCell>GPT-4o</TableCell>
                <TableCell>May 10, 2023</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="h-2 w-16" />
                    <span className="text-xs">88%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Inactive</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Use Model
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

// Import Badge component for the models tab
import { Badge } from "@/components/ui/badge"
