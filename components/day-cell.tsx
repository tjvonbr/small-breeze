import { CalendarEvent } from "@/lib/ics-parser"
import BookingBar from "./booking-bar"
import { cn, isSameDay } from "@/lib/utils"

interface DayCellProps {
  day: Date
  events: CalendarEvent[]
  selectDate: (date: Date) => void
  showOnlyCheckoutDays?: boolean
  isOutsideMonth?: boolean
}

export default function DayCell({ day, events, selectDate, showOnlyCheckoutDays = false, isOutsideMonth = false }: DayCellProps) {
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

  const hasCheckinToday = events.some((e) => isSameDay(e.start, date))
  const hasCheckoutToday = events.some((e) => isSameDay(e.end, date))
  const hasTurnoverToday = hasCheckinToday && hasCheckoutToday

  return (
    <div 
      className={cn(
        "relative w-full aspect-square p-2 border-[0.5px] border-border hover:bg-muted/50 cursor-pointer",
        isOutsideMonth && "bg-muted"
      )}
      onClick={() => selectDate(day)}
    >
      <p className="text-sm absolute top-2 right-2 z-10">{date.getDate()}</p>
      <div className="absolute inset-0 pointer-events-none">
        {eventsForDay.map((event) => (
          <BookingBar
            key={event.id}
            event={event}
            currentDate={date}
            isCheckoutOnly={showOnlyCheckoutDays}
            hasTurnoverToday={hasTurnoverToday}
          />
        ))}
      </div>
    </div>
  )
}