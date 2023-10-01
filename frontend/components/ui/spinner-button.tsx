import * as React from "react"
import { RxUpdate } from "react-icons/rx"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SpinnerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

const SpinnerButton = React.forwardRef<HTMLButtonElement, SpinnerButtonProps>(
  ({ disabled, loading, children, className }, ref) => {
    return (
      <Button disabled={disabled || loading} ref={ref} className={className}>
        <span>{children}</span>
        {loading && <RxUpdate className="w-4 h-4 animate-spin" />}
      </Button>
    )
  }
)

SpinnerButton.displayName = "SpinnerButton"
export default SpinnerButton
