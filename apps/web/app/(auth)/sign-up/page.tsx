import Link from "next/link"
import { cn } from "@//lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import SignUpForm from "@/components/sign-up-form"
import { Suspense } from "react"
import Logo from "@/components/logo"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default async function RegisterPage() {  
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden h-full bg-muted lg:block p-9">
      <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
        >
          <Icons.left className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Link>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign in
        </Link>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Logo />

            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information below to create your account
            </p>
          </div>
          <Suspense>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}