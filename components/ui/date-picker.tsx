"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({
  date,
  onSelect,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-background border shadow-md" 
        align="start"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="bg-background">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 