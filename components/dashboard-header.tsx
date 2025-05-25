import type React from "react"

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </div>
  )
}
