
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import React from "react";

export default async function ChannelsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Properties"
        text="Manage your properties and their settings"
      />
        <div className="flex flex-col items-center justify-center h-full">
          <p>Integrations found</p>
        </div>
    </DashboardShell>
  );
}