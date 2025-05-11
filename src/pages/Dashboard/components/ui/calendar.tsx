"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...classNames,
        head_cell: cn("text-muted-foreground rounded-md opacity-50", classNames?.head_cell),
        day: cn(
          "p-0 relative text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md",
          classNames?.day,
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          classNames?.day_selected,
        ),
        day_today: cn("bg-accent text-accent-foreground", classNames?.day_today),
        day_outside: cn("text-muted-foreground opacity-50", classNames?.day_outside),
        day_disabled: cn("text-muted-foreground opacity-50", classNames?.day_disabled),
        day_range_middle: cn(
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          classNames?.day_range_middle,
        ),
        day_hidden: cn("invisible", classNames?.day_hidden),
        ...classNames,
      }}
      components={{
        // Use the correct component names from the react-day-picker library
        PreviousMonthButton: () => <ChevronLeft className="h-4 w-4" />,
        NextMonthButton: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

export function DatePicker({}: {}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date?.toLocaleDateString() : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
