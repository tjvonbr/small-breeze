import { CalendarEvent } from "@/lib/ics-parser"
import BookingBar from "./booking-bar"

interface DayCellProps {
  day: Date
  events: CalendarEvent[]
  selectDate: (date: Date) => void
}

export default function DayCell({ day, events, selectDate }: DayCellProps) {
  const date = new Date(day)

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const eventsForDay = events.filter((event) => {
    return event.start <= endOfDay && event.end >= startOfDay
  })

  return (
    <div 
      className="relative w-full aspect-square p-2 hover:bg-muted/50 cursor-pointer rounded-md border border-border/50" 
      onClick={() => selectDate(day)}
    >
      <p className="text-sm absolute top-2 right-2">{date.getDate()}</p>
      {eventsForDay.map((event) => (
        <BookingBar key={event.id} event={event} currentDate={date} />
      ))}
    </div>
  )
}