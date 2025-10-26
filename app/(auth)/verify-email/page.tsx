import Logo from "@/components/logo";

export default function VerifyEmailPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <Logo />
        <h1 className="text-2xl font-semibold tracking-tight">
          Please verify your email address
        </h1>
        <p className="text-sm text-muted-foreground">
          Please check your inbox and click the link in the email to verify your email address.  You may close this tab when you successfully verify your email!
        </p>
      </div>
    </div>
  </div>
  )
}