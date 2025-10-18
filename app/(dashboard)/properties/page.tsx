import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import { getListingsByUserId } from "@/lib/listings";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

  const listings = await getListingsByUserId(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Properties"
        text="Manage your properties and their settings"
      >
        <Link href="/properties/new" className={cn(buttonVariants(), "hover:cursor-pointer")}>
          <Icons.plus className="h-4 w-4" />
          <p>Add new listing</p>
        </Link>
      </DashboardHeader>
      <Card className="mt-6">
        <CardContent>
          <div className="overflow-x-auto">
            {listings.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-lg text-muted-foreground">No properties found. Create your first property to get started.</div>
              </div>
            ) : (
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
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}