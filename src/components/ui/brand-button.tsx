import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const brandButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "brand-gradient text-white shadow-brand hover:shadow-lg hover:scale-105",
        secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-sm",
        accent: "success-gradient text-white shadow-success hover:shadow-lg hover:scale-105",
        outline: "border-2 border-brand-primary text-brand-primary hover:brand-gradient hover:text-white",
        ghost: "text-brand-primary hover:bg-brand-primary/10",
        hero: "hero-gradient text-white shadow-brand hover:shadow-xl hover:scale-105 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {
  asChild?: boolean
}

const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(brandButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
BrandButton.displayName = "BrandButton"

export { BrandButton, brandButtonVariants }