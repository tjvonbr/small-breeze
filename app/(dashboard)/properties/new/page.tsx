import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import NewPropertyForm from "@/components/new-property-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
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