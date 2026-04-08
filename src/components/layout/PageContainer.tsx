"use client"

import React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        width: "100%",
      }}
      className={className}
    >
      {children}
    </div>
  )
}