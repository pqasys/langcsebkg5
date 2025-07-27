"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface EnhancedSwitchProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  activeColor?: string
  inactiveColor?: string
  activeText?: string
  inactiveText?: string
  className?: string
  variant?: 'default' | 'compact'
}

export function EnhancedSwitch({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  activeColor = "green",
  inactiveColor = "red",
  activeText = "ON",
  inactiveText = "OFF",
  className,
  variant = 'default'
}: EnhancedSwitchProps) {
  const colorClasses = {
    green: {
      active: "border-green-300 bg-green-50",
      inactive: "border-red-300 bg-red-50",
      labelActive: "text-green-800",
      labelInactive: "text-red-800",
      descActive: "text-green-600",
      descInactive: "text-red-600",
      badgeActive: "bg-green-100 text-green-800",
      badgeInactive: "bg-red-100 text-red-800",
      switchActive: "data-[state=checked]:bg-green-600",
      switchInactive: "data-[state=checked]:bg-red-600"
    },
    blue: {
      active: "border-blue-300 bg-blue-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-blue-800",
      labelInactive: "text-gray-800",
      descActive: "text-blue-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-blue-100 text-blue-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-blue-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    purple: {
      active: "border-purple-300 bg-purple-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-purple-800",
      labelInactive: "text-gray-800",
      descActive: "text-purple-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-purple-100 text-purple-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-purple-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    orange: {
      active: "border-orange-300 bg-orange-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-orange-800",
      labelInactive: "text-gray-800",
      descActive: "text-orange-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-orange-100 text-orange-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-orange-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    emerald: {
      active: "border-emerald-300 bg-emerald-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-emerald-800",
      labelInactive: "text-gray-800",
      descActive: "text-emerald-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-emerald-100 text-emerald-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-emerald-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    indigo: {
      active: "border-indigo-300 bg-indigo-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-indigo-800",
      labelInactive: "text-gray-800",
      descActive: "text-indigo-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-indigo-100 text-indigo-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-indigo-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    amber: {
      active: "border-amber-300 bg-amber-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-amber-800",
      labelInactive: "text-gray-800",
      descActive: "text-amber-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-amber-100 text-amber-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-amber-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    },
    yellow: {
      active: "border-yellow-300 bg-yellow-50",
      inactive: "border-gray-300 bg-gray-50",
      labelActive: "text-yellow-800",
      labelInactive: "text-gray-800",
      descActive: "text-yellow-600",
      descInactive: "text-gray-600",
      badgeActive: "bg-yellow-100 text-yellow-800",
      badgeInactive: "bg-gray-100 text-gray-800",
      switchActive: "data-[state=checked]:bg-yellow-600",
      switchInactive: "data-[state=checked]:bg-gray-600"
    }
  }

  const colors = colorClasses[activeColor as keyof typeof colorClasses] || colorClasses.green

  return (
    <div className={cn(
      `p-3 rounded-lg border transition-all duration-200 ${
        checked ? colors.active : colors.inactive
      }`,
      variant === 'compact' && 'p-2',
      className
    )}>
      <div className={cn(
        "flex items-center justify-between",
        variant === 'compact' && "space-x-2"
      )}>
        <div className={cn(
          "flex items-center space-x-3",
          variant === 'compact' && "space-x-2"
        )}>
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={cn(
              checked ? colors.switchActive : colors.switchInactive,
              variant === 'compact' && "scale-90"
            )}
          />
          <div className={cn(
            variant === 'compact' && "min-w-0 flex-1"
          )}>
            <Label 
              htmlFor={id} 
              className={cn(
                "text-sm font-medium",
                checked ? colors.labelActive : colors.labelInactive,
                variant === 'compact' && "text-xs"
              )}
            >
              {label}
            </Label>
            {description && variant === 'default' && (
              <p className={cn(
                "text-xs",
                checked ? colors.descActive : colors.descInactive
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
        {variant === 'default' && (
          <span className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            checked ? colors.badgeActive : colors.badgeInactive
          )}>
            {checked ? activeText : inactiveText}
          </span>
        )}
        {variant === 'compact' && (
          <span className={cn(
            "px-1.5 py-0.5 rounded text-xs font-medium",
            checked ? colors.badgeActive : colors.badgeInactive
          )}>
            {checked ? activeText : inactiveText}
          </span>
        )}
      </div>
    </div>
  )
} 