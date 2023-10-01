"use client"
import { IconType } from "react-icons"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

interface EntityProps {
  className?: string
  /** Description of the entity */
  description: string
  /** Value associated with the entity */
  value: string
  /** Name of the entity */
  name: string
  /** Icon component to render */
  icon: IconType
}

/**
 * Entity component displays an entity with a copy button.
 *
 * @param {EntityProps} props - Component props
 * @returns {React.ReactElement} - Rendered component
 */
export const Entity: React.FC<EntityProps> = ({
  className,
  description,
  value,
  name,
  icon: Icon,
}: EntityProps): React.ReactElement => {
  const [_, copy] = useCopyToClipboard()

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Typography variant="h6" as="h6">
        {name}
      </Typography>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copy(value)}
              className={`w-10 h-10 bg-box`}
            >
              <Icon aria-label={`Copy ${name}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-foreground">Click to copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Typography variant="smallText" as="span">
        {description}
      </Typography>
    </div>
  )
}
