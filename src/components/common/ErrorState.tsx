"use client"

import Button from "@/components/ui/Button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      {/* Icon */}
      <div className="text-4xl">⚠️</div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-red-600">{title}</h2>

      {/* Message */}
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>

      {/* Retry Button */}
      {onRetry && (
        <div className="mt-2">
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}