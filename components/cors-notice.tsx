import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function CorsNotice() {
  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>CORS Configuration Required</AlertTitle>
      <AlertDescription>
        If you're having issues connecting to your local AI model, you may need to enable CORS in your FastAPI backend.
        Update your backend.py file to include:
        <pre className="mt-2 rounded bg-muted p-2 text-xs">
          {`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}
        </pre>
      </AlertDescription>
    </Alert>
  )
}
