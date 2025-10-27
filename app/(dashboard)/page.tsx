
import CalendarView from '@/components/calendar-view';
import { auth } from '@/lib/auth';
import { getCalendarLinksByTeamId } from '@/lib/calendar-links';
import { getCurrentTeamIdFromCookies } from '@/lib/actions/teams';
import { ensureUserHasTeam } from '@/lib/teams';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CalendarPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  await ensureUserHasTeam(session.user.id, `${session.user.firstName} ${session.user.lastName}'s Team`)
  const teamId = await getCurrentTeamIdFromCookies()
  const events = await getCalendarLinksByTeamId(teamId || session.user.id)

  return <CalendarView events={events} showOnlyCheckoutDays={true} />;
}