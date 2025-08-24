
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PropertiesSubnav } from "@/components/properties-subnav";
import { mockListings } from "@/lib/mock-listings";
import Link from "next/link";
import React from "react";

function formatUpdatedAt(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default async function ChannelsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Properties"
        text="Manage your properties and their settings"
      />
      <PropertiesSubnav />
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
                {mockListings.map((listing) => {
                  const address = `${listing.streetAddress}, ${listing.city}, ${listing.state} ${listing.zip}`
                  return (
                    <tr key={listing.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">
                        <Link href={`/properties/${listing.id}`} className="hover:underline" aria-label={`View ${listing.nickname}`}>
                          {listing.nickname}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{address}</td>
                      <td className="px-4 py-3 text-muted-foreground">{listing.country}</td>
                      <td className="px-4 py-3 text-muted-foreground">{listing.calendarLinks.length}</td>
                      <td className="pl-4 py-3 text-muted-foreground">{formatUpdatedAt(listing.updatedAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}