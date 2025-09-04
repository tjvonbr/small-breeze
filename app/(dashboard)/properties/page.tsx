'use client';

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PropertiesSubnav } from "@/components/properties-subnav";
import { mockListings } from "@/lib/mock-listings";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import firebase from "@/lib/firebase";
import { getListingsByUserId } from "@/lib/listings";

// Unified interface that can handle both Prisma and mock data
interface UnifiedListing {
  id: string;
  nickname: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  calendarLinks: Array<{ id: string; url: string }>;
}

function formatUpdatedAt(dateValue: Date | string) {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function PropertiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<UnifiedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebase);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userListings = await getListingsByUserId(user.uid);
          // Convert Prisma listings to unified format
          const unifiedListings: UnifiedListing[] = userListings.map((listing: any) => ({
            id: listing.id,
            nickname: listing.nickname,
            streetAddress: listing.streetAddress,
            city: listing.city,
            state: listing.state,
            zip: listing.zip,
            country: listing.country,
            createdAt: listing.createdAt,
            updatedAt: listing.updatedAt,
            userId: listing.userId,
            calendarLinks: listing.calendarLinks || []
          }));
          setListings(unifiedListings);
        } catch (error) {
          console.error('Error fetching listings:', error);
          // Fallback to mock data if there's an error
          setListings(mockListings);
        }
      } else {
        // No user signed in, show empty state or redirect
        setListings([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Properties"
          text="Manage your properties and their settings"
        />
        <PropertiesSubnav />
        <Card className="mt-6">
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-lg">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Properties"
          text="Manage your properties and their settings"
        />
        <PropertiesSubnav />
        <Card className="mt-6">
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-lg">Please sign in to view your properties</div>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

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