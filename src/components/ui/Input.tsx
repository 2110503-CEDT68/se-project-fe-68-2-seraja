"use client"

import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export default function Input({
  label,
  error,
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name

  const wrapperClass = ["flex flex-col gap-1", fullWidth ? "w-full" : ""].filter(Boolean).join(" ")

  const inputClass = [
    "px-3 py-2 rounded-lg border transition duration-200 outline-none",
    "focus:ring-2 focus:ring-blue-500",
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500",
    className ?? "",
  ].filter(Boolean).join(" ")

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input id={inputId} className={inputClass} {...props} />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}