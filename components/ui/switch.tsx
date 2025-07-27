"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-gray-300 data-[state=unchecked]:border-gray-400 dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=unchecked]:border-gray-600 hover:data-[state=checked]:bg-primary/90 hover:data-[state=unchecked]:bg-gray-400 dark:hover:data-[state=unchecked]:bg-gray-600 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
      className
    )}
    {...props}
    ref={ref}
    role="switch"
    aria-checked={props.checked}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white data-[state=unchecked]:bg-white data-[state=checked]:shadow-lg data-[state=unchecked]:shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-600"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch } 