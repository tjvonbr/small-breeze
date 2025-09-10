import { auth } from '@/auth';
import CalendarView from '@/components/calendar-view';
import { getCalendarLinksByUserId } from '@/lib/calendar-links';
import { redirect } from 'next/navigation';

export default async function CalendarPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const events = await getCalendarLinksByUserId(session.user.id)

  return <CalendarView events={events} showOnlyCheckoutDays={true} />;
}