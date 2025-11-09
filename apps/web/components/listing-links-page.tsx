"use client"

import React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { ListingWithCalendarLinks } from "@/types/listings";
import NewCalendarLinkForm from "./new-calendar-link-form";
import { PropertiesSubnav } from "@/components/properties-subnav";

export default function ListingLinksPageOps({ listing }: { listing: ListingWithCalendarLinks }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={listing.nickname} text="Manage calendar link integrations for this property" />
      <PropertiesSubnav />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid gap-6">
          <NewCalendarLinkForm listingId={listing.id} />
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Existing Links</div>
            {listing.calendarLinks.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {listing.calendarLinks.map((c) => (
                  <li key={c.id}>
                    <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline break-all">
                      {c.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No links yet.</div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}