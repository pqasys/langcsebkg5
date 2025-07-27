import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:ring-blue-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        destructive:
          "bg-red-600 text-white shadow-lg hover:bg-red-700 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        outline:
          "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:focus-visible:ring-offset-gray-900",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 focus-visible:ring-offset-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus-visible:ring-offset-gray-900",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500 focus-visible:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus-visible:ring-blue-500 focus-visible:ring-offset-white dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-offset-gray-900",
        save: "bg-green-600 text-white shadow-lg hover:bg-green-700 focus-visible:ring-green-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:bg-gray-400",
        update: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:ring-blue-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:bg-gray-400",
        cancel: "bg-gray-600 text-white shadow-lg hover:bg-gray-700 focus-visible:ring-gray-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:bg-gray-400",
        delete: "bg-red-600 text-white shadow-lg hover:bg-red-700 focus-visible:ring-red-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:bg-gray-400",
        pricing: "bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus-visible:ring-purple-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:bg-gray-400",
        // New high-contrast variants for better accessibility
        "primary-high": "bg-blue-700 text-white shadow-lg hover:bg-blue-800 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        "success-high": "bg-green-700 text-white shadow-lg hover:bg-green-800 focus-visible:ring-green-600 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        "warning-high": "bg-yellow-600 text-gray-900 shadow-lg hover:bg-yellow-700 focus-visible:ring-yellow-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        "danger-high": "bg-red-700 text-white shadow-lg hover:bg-red-800 focus-visible:ring-red-600 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
      },
      size: {
        default: "h-11 px-6 py-3 text-base font-semibold",
        sm: "h-10 px-4 py-2 text-sm font-medium",
        lg: "h-12 px-8 py-4 text-lg font-semibold",
        icon: "h-11 w-11 p-0",
        "mobile-sm": "h-12 px-4 py-3 text-base font-semibold sm:h-10 sm:px-4 sm:py-2 sm:text-sm sm:font-medium",
        "mobile-lg": "h-14 px-6 py-4 text-lg font-semibold sm:h-12 sm:px-8 sm:py-4 sm:text-lg sm:font-semibold",
        "mobile-icon": "h-12 w-12 p-0 sm:h-11 sm:w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Simplified version - remove complex accessibility props and mobile styles
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 