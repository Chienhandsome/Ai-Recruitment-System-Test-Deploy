import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  centered?: boolean
}

export function SectionHeading({
  title,
  description,
  centered = false,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-8 md:mb-10",
        centered && "text-center items-center",
        className
      )}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}
