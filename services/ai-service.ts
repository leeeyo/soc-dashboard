// Types for AI models
export interface AIModel {
  id: string
  name: string
  type: "local" | "remote"
  endpoint?: string
  description: string
}

// Available AI models
export const availableModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    type: "remote",
    description: "OpenAI's most advanced model for general-purpose tasks",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    type: "remote",
    description: "Efficient model for most tasks with good performance",
  },
  {
    id: "local-mistral",
    name: "Local Mistral 7B",
    type: "local",
    endpoint: "http://localhost:8000/generate",
    description: "Locally hosted Mistral 7B Instruct model",
  },
]

// Function to generate text with a local model
export async function generateTextWithLocalModel(
  modelId: string,
  prompt: string,
  options?: {
    temperature?: number
    maxTokens?: number
    onProgress?: (text: string) => void
  },
): Promise<{ text: string }> {
  const model = availableModels.find((m) => m.id === modelId)

  if (!model || model.type !== "local" || !model.endpoint) {
    throw new Error("Invalid local model specified")
  }

  console.log("Sending request to local model:", model.endpoint)
  console.log("Prompt (first 50 chars):", prompt.substring(0, 50))

  try {
    const response = await fetch(model.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        max_tokens: options?.maxTokens || 128, // Reduced token limit for faster response
        temperature: options?.temperature || 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Error from local model: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Received response:", data)

    if (!data.output) {
      throw new Error("Invalid response format from local model")
    }

    return { text: data.output }
  } catch (error) {
    console.error("Error generating text with local model:", error)
    throw error
  }
}

// Function to test connection to local model
export async function testLocalModelConnection(endpoint: string): Promise<boolean> {
  try {
    // First try the health endpoint if available
    try {
      const healthResponse = await fetch(endpoint.replace("/generate", "/health"), {
        method: "GET",
      })
      if (healthResponse.ok) {
        return true
      }
    } catch (e) {
      console.log("Health endpoint not available, trying with a test prompt")
    }

    // Fall back to a simple prompt test
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Say hello",
        max_tokens: 10,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Error testing connection:", error)
    return false
  }
}

// Function to get model parameters
export function getModelParameters(modelId: string) {
  const model = availableModels.find((m) => m.id === modelId)

  if (!model) {
    return {
      maxTokens: 64,
      temperature: 0.1,
    }
  }

  if (model.type === "local") {
    return {
      maxTokens: 64, // Default for local models - reduced for faster response
      temperature: 0.1,
    }
  } else {
    // Cloud models can handle more tokens
    return {
      maxTokens: 512,
      temperature: 0.7,
    }
  }
}

// Report templates
export const reportTemplates = {
  incident: {
    title: "Incident Report",
    sections: [
      "Executive Summary",
      "Incident Timeline",
      "Technical Details",
      "Impact Assessment",
      "Remediation Steps",
      "Recommendations",
    ],
    prompt: (
      context = "",
    ) => `You are a cybersecurity expert. Generate a detailed incident report for a security operations center.

Incident: Mimikatz detection with credential theft attempts
Date: ${new Date().toLocaleDateString()}
Severity: Critical

Include the following sections:
1. Executive Summary
2. Incident Timeline
3. Technical Details
4. Impact Assessment
5. Remediation Steps
6. Recommendations

${context ? `Additional context: ${context}` : ""}

Generate a professional report.`,
  },
  threat: {
    title: "Threat Intelligence Report",
    sections: [
      "Threat Overview",
      "Indicators of Compromise (IOCs)",
      "Attack Techniques (MITRE ATT&CK)",
      "Threat Actor Profile",
      "Defensive Recommendations",
    ],
    prompt: (
      context = "",
    ) => `You are a threat intelligence analyst. Generate a comprehensive threat intelligence report.

Focus on: Recent malware campaigns and threat actors
Date: ${new Date().toLocaleDateString()}

Include the following sections:
1. Threat Overview
2. Indicators of Compromise (IOCs)
3. Attack Techniques (MITRE ATT&CK)
4. Threat Actor Profile
5. Defensive Recommendations

${context ? `Additional context: ${context}` : ""}

Generate a professional report.`,
  },
  summary: {
    title: "Executive Summary",
    sections: ["Key Metrics", "Major Incidents", "Threat Landscape", "Risk Assessment", "Strategic Recommendations"],
    prompt: (context = "") => `You are a security executive. Generate an executive summary report for the SOC.

Period: Last 7 days
Date: ${new Date().toLocaleDateString()}

Include the following sections:
1. Key Metrics
2. Major Incidents
3. Threat Landscape
4. Risk Assessment
5. Strategic Recommendations

${context ? `Additional context: ${context}` : ""}

Generate a professional report.`,
  },
}
