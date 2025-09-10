import { CalendarEvent } from "@/lib/ics-parser"
import BookingBar from "./booking-bar"
import { isSameDay } from "@/lib/utils"

interface DayCellProps {
  day: Date
  events: CalendarEvent[]
  selectDate: (date: Date) => void
  showOnlyCheckoutDays?: boolean
}

export default function DayCell({ day, events, selectDate, showOnlyCheckoutDays = false }: DayCellProps) {
  const date = new Date(day)

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const eventsForDay = events.filter((event) => {
    const isEventOnDay = event.start <= endOfDay && event.end >= startOfDay
    
    if (showOnlyCheckoutDays) {
      // Only show events that have a checkout (end date) on this day
      return isEventOnDay && isSameDay(event.end, date)
    }
    
    return isEventOnDay
  })

  return (
    <div 
      className="relative w-full aspect-square p-2 hover:bg-muted/50 cursor-pointer rounded-md border border-border/50" 
      onClick={() => selectDate(day)}
    >
      <p className="text-sm absolute top-2 right-2">{date.getDate()}</p>
      {eventsForDay.map((event) => (
        <BookingBar key={event.id} event={event} currentDate={date} isCheckoutOnly={showOnlyCheckoutDays} />
      ))}
    </div>
  )
}