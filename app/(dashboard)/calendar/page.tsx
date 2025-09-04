import CalendarView from '@/components/calendar-view';
import { fetchAllICSFiles } from '@/lib/ics-fetcher';

const events = await fetchAllICSFiles([
  "https://www.airbnb.com/calendar/ical/1439625607774765542.ics?s=cc888b862fcae55c27cdd5ae79e70232"
])

export default function Home() {
  return <CalendarView events={events} />;
}