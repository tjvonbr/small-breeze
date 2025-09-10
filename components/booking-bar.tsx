import { CalendarEvent } from "@/lib/ics-parser";
import { isSameDay } from "@/lib/utils";

interface BookingBarProps {
  event: CalendarEvent;
  currentDate: Date;
  isCheckoutOnly?: boolean;
}

export default function BookingBar({ event, currentDate, isCheckoutOnly = false }: BookingBarProps) {
  const isStartDate = isSameDay(event.start, currentDate);
  const isEndDate = isSameDay(event.end, currentDate);

  const getBarStyles = () => {
      if (isCheckoutOnly) {
        return "h-6 w-4/5 left-1/2 -translate-x-1/2 rounded-sm";
      }
    
    if (isStartDate) {
      return "h-6 w-1/2 right-0 rounded-l-full";
    } else if (isEndDate) {
      return "h-6 w-1/2 left-0 rounded-r-full";
    } else {
      return "h-6 w-full left-0";
    }
  };

  return (
    <div
      className={`absolute top-1/2 flex justify-center items-center -translate-y-1/2 bg-primary dark:bg-white ${getBarStyles()}`}
      title={`${event.summary} - ${event.start.toLocaleDateString()} to ${event.end.toLocaleDateString()}`}
    >
      {isCheckoutOnly && <p className="text-xs text-white">{event.listing.nickname}</p>}
    </div>
  );
}
