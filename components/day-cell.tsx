import { CalendarEvent } from "@/lib/ics-parser"
import { isSameDay } from "@/lib/utils"

interface DayCellProps {
  day: Date
  events: CalendarEvent[]
}

export default function DayCell({ day, events }: DayCellProps) {
  const date = new Date(day)

  const checkOuts = events.filter((event) => isSameDay(event.end, date))

  return (
    <div className="relative w-full h-20 p-3 border rounded-lg hover:bg-muted/50">
      <p className="text-sm absolute top-2 right-2">{date.getDate()}</p>
      {checkOuts.map((event, index) => (
        <div 
          key={event.id} 
          className="absolute left-2 bottom-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-black text-white rounded-sm border border-blue-200 max-w-[calc(100%-1rem)] truncate"
          style={{ bottom: `${0.5 + index * 1.5}rem` }}
        >
          {event.id}
        </div>
      ))}
    </div>
  )
}