"use client"

import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...rest
}: CardProps) {
  const classes = [
    "bg-white rounded-2xl shadow-md border border-gray-100",
    "transition duration-200",
    hoverable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "",
    onClick ? "cursor-pointer" : "",
    className ?? "",
  ].filter(Boolean).join(" ")

  return (
    <div onClick={onClick} className={classes} {...rest}>
      {children}
    </div>
  )
}