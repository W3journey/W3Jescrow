"use client"
import { CopyIcon } from "@radix-ui/react-icons"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CopyButtonProps {
  value: string | `0x${string}`
  delayDuration?: number
}

const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  delayDuration = 300,
}) => {
  const [_, copy] = useCopyToClipboard()

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={() => copy(value)}>
            <CopyIcon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
export default CopyButton
