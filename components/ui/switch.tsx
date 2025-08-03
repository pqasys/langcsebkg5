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
      "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300 dark:data-[state=unchecked]:bg-gray-600 dark:data-[state=unchecked]:border-gray-500 hover:data-[state=checked]:bg-blue-700 hover:data-[state=unchecked]:bg-gray-300 dark:hover:data-[state=unchecked]:bg-gray-500 focus:ring-2 focus:ring-blue-600/20 focus:ring-offset-2",
      className
    )}
    {...props}
    ref={ref}
    role="switch"
    aria-checked={props.checked}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white data-[state=unchecked]:bg-white data-[state=checked]:shadow-xl data-[state=unchecked]:shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-600"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch } 