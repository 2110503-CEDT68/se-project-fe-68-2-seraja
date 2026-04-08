"use client"

import React, { useEffect } from "react"

interface ModalProps {
  open: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
  size?: "sm" | "md" | "lg"
  closeOnOverlay?: boolean
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "md",
  closeOnOverlay = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "auto"
    }
  }, [open, onClose])

  if (!open) return null

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }

  function handleOverlayClick() {
    if (closeOnOverlay) onClose()
  }

  // --- THE CHANGE IS HERE ---
  // Combine strings manually using template literals
  const modalClasses = `w-full rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto ${sizeStyles[size]}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleOverlayClick}
    >
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title || "Modal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}