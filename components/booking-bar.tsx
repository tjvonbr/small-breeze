import { CalendarEvent } from "@/lib/ics-parser";
import { isSameDay } from "@/lib/utils";

interface BookingBarProps {
  event: CalendarEvent;
  currentDate: Date;
}

export default function BookingBar({ event, currentDate }: BookingBarProps) {
  const isStartDate = isSameDay(event.start, currentDate);
  const isEndDate = isSameDay(event.end, currentDate);

  // Determine the width and positioning based on the date type
  const getBarStyles = () => {
    if (isStartDate) {
      return "h-6 w-1/2 right-0 rounded-l-sm"; // Half bar on the right side for start date
    } else if (isEndDate) {
      return "h-6 w-1/2 left-0 rounded-r-sm"; // Half bar on the left side for end date
    } else {
      return "h-6 w-full left-0"; // Full width bar for middle dates
    }
  };

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 h-1.5 bg-primary dark:bg-white ${getBarStyles()}`}
      title={`${event.summary} - ${event.start.toLocaleDateString()} to ${event.end.toLocaleDateString()}`}
    />
  );
}
