"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Form } from "./ui/form";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/validations";
import authClient from "@/lib/auth-client";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof signUpSchema>;

export default function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        callbackURL: "/",
        firstName: data.firstName,
        lastName: data.lastName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      setIsLoading(false);

      if (error) {
        return toast.error("Something went wrong.", {
          description: error.message || "Your sign up request failed. Please try again.",
        });
      }

      return toast.success("Account created!", {
        description: "Welcome! You can now sign in.",
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong.", {
        description: error instanceof Error ? error.message : "Your sign up request failed. Please try again.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div className="grid gap-2">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label className="" htmlFor="firstName">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="given-name"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...form.register("firstName")}
                    />
                    {form.formState.errors?.firstName && (
                      <p className="px-1 text-xs text-red-600">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1">
                    <Label className="" htmlFor="lastName">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="family-name"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...form.register("lastName")}
                    />
                    {form.formState.errors?.lastName && (
                      <p className="px-1 text-xs text-red-600">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("email")}
                  />
                  {form.formState.errors?.email && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("password")}
                  />
                  {form.formState.errors?.password && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={cn(buttonVariants(), "hover:cursor-pointer")}
                disabled={isLoading}
                onClick={async () => {
                  const ok = await form.trigger(["firstName", "lastName", "email", "password"])
                  if (ok) setStep(2)
                }}
              >
                Continue
              </button>
            </div>
          ) : (
              <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="teamName">Team name</Label>
                <Input
                  id="teamName"
                  defaultValue={`${form.watch("firstName")} ${form.watch("lastName")}'s Team`}
                  type="text"
                  autoCapitalize="none"
                  autoComplete="organization"
                  autoCorrect="off"
                  disabled={isLoading}
                  placeholder="e.g. SmallBreeze Inc."
                  {...form.register("teamName")}
                />
                {form.formState.errors?.teamName && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.teamName.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "outline" }))}
                  disabled={isLoading}
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button className={cn(buttonVariants(), "hover:cursor-pointer")} disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create account
                </button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
