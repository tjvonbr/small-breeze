import { CalendarEvent } from "@/lib/ics-parser"
import { isSameDay } from "@/lib/utils"

interface DayCellProps {
  day: Date
  events: CalendarEvent[]
  selectDate: (date: Date) => void
}

export default function DayCell({ day, events, selectDate }: DayCellProps) {
  const date = new Date(day)

  const checkOuts = events.filter((event) => isSameDay(event.end, date))

  return (
    <div 
      className="relative w-full aspect-square p-2 hover:bg-muted/50 cursor-pointer rounded-md" 
      onClick={() => selectDate(day)}
    >
      <p className="text-sm absolute top-2 right-2">{date.getDate()}</p>
      {checkOuts.map((event, index) => (
        <div 
          key={event.id} 
          className="absolute left-1 bottom-1 inline-flex items-center px-1 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 rounded-sm border border-blue-200 max-w-[calc(100%-0.5rem)] truncate"
          style={{ bottom: `${0.25 + index * 1}rem` }}
        >
          {event.id}
        </div>
      ))}
    </div>
  )
}