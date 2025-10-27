import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import { getListingsByTeamId } from "@/lib/listings";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import EmptyProperties from "@/components/empty-properties";
import AddListingButton from "@/components/add-listing-button";
import { getCurrentTeamIdFromCookies } from "@/lib/actions/teams";
import { ensureUserHasTeam } from "@/lib/teams";

function formatUpdatedAt(dateValue: Date | string) {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function PropertiesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  await ensureUserHasTeam(session.user.id, `${session.user.firstName} ${session.user.lastName}'s Team`)
  const cookieTeamId = await getCurrentTeamIdFromCookies()
  const effectiveTeamId = cookieTeamId ?? session.user.id
  const listings = await getListingsByTeamId(effectiveTeamId)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Properties"
        text="Manage your properties and their settings"
      >
        {listings.length > 0 && <AddListingButton />}
      </DashboardHeader>
      {listings.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <EmptyProperties />
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-3 pr-4 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Calendars</th>
                    <th className="pl-4 py-3 font-medium">Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => {
                    const address = `${listing.streetAddress}, ${listing.city}, ${listing.state} ${listing.zip}`;
                    const calendarCount = listing.calendarLinks.length;
                    return (
                      <tr key={listing.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">
                          <Link href={`/properties/${listing.id}`} className="hover:underline" aria-label={`View ${listing.nickname}`}>
                            {listing.nickname}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{address}</td>
                        <td className="px-4 py-3 text-muted-foreground">{listing.country}</td>
                        <td className="px-4 py-3 text-muted-foreground">{calendarCount}</td>
                        <td className="pl-4 py-3 text-muted-foreground">{formatUpdatedAt(listing.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}