
import React from "react";
import { redirect } from "next/navigation";
import { getListingById } from "@/lib/listings";
import ListingLinksPageOps from "@/components/listing-links-page";

interface PropertyLinksPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyLinksPage({ params }: PropertyLinksPageProps) {
  const { id } = await params

  const listing = await getListingById(id)

  if (!listing) {
    redirect("/properties")
  }

  return <ListingLinksPageOps listing={listing} />
} 