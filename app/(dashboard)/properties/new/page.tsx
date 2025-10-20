import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import NewPropertyForm from "@/components/new-property-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Properties"
        text="Add a new property"
      />
      <NewPropertyForm />
    </DashboardShell>
  );
}