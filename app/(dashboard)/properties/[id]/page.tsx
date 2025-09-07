import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PropertiesSubnav } from "@/components/properties-subnav";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { getListingById } from "@/lib/listings";

interface PropertyPageProps {
  params: { id: string }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const { id } = await params

  const listing = await getListingById(id)

  if (!listing) {
    redirect("/properties")
  }

  const address = `${listing.streetAddress}, ${listing.city}, ${listing.state} ${listing.zip}`

  return (
    <DashboardShell>
      <DashboardHeader heading={listing.nickname} text="Property details" />
      <PropertiesSubnav />
      <Card className="mt-6">
        <CardContent>
          <div className="grid gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="text-base">{address}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Country</div>
                <div className="text-base">{listing.country}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Calendars</div>
                <div className="text-base">{listing.calendarLinks.length}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Calendar Links</div>
                {listing.calendarLinks.length > 0 ? (
                  <ul className="list-disc pl-4 text-sm">
                    {listing.calendarLinks.map((c) => (
                      <li key={c.id}>
                        <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline break-all">{c.url}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No calendar links yet.</div>
                )}
              </div>
              <Link 
                href={`/properties/${listing.id}/links`}
                className="text-sm text-primary hover:underline"
              >
                Manage Links
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 