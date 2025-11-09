import React from "react";
import AddListingButton from "./add-listing-button";

export default function EmptyProperties() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-lg text-muted-foreground">Add your first property to get started.</div>
      <AddListingButton />
    </div>
  )
}
