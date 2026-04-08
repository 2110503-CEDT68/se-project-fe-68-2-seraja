"use client"

interface LoadingStateProps {
  message?: string
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      {/* Spinner */}
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

      {/* Text */}
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}