
import CalendarView from '@/components/calendar-view';
import { auth } from '@/lib/auth';
import { getCalendarLinksByUserId } from '@/lib/calendar-links';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CalendarPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log(session)

  if (!session) {
    redirect("/sign-in")
  }

  const events = await getCalendarLinksByUserId(session.user.id)

  return <CalendarView events={events} showOnlyCheckoutDays={true} />;
}