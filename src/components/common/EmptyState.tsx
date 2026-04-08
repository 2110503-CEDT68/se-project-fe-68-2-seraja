"use client"

import Button from "@/components/ui/Button"

interface EmptyStateProps {
  title?: string
  message?: string
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({
  title = "No data",
  message = "There is nothing to display right now.",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      {/* Icon / Emoji */}
      <div className="text-4xl">📭</div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* Message */}
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>

      {/* Optional Action Button */}
      {actionText && onAction && (
        <div className="mt-2">
          <Button onClick={onAction}>{actionText}</Button>
        </div>
      )}
    </div>
  )
}