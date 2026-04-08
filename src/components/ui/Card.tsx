"use client"

import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className,
  hoverable = false,
  onClick,
}: CardProps) {
  const classes = [
    "bg-white rounded-2xl shadow-md border border-gray-100",
    "transition duration-200",
    hoverable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "",
    onClick ? "cursor-pointer" : "",
    className ?? "",
  ].filter(Boolean).join(" ")

  return (
    <div onClick={onClick} className={classes}>
      {children}
    </div>
  )
}