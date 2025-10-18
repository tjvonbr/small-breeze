"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { toast } from "sonner";
import authClient from "@/lib/auth-client";
import Link from "next/link";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof loginSchema>;

export function SignInForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        callbackURL: "/"
      });

      setIsLoading(false);

      if (error) {
        console.log(error);
        return toast.error("Something went wrong.", {
          description: "Your sign in request failed. Please try again.",
        });
      }

      return toast.success("Check your email", {
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      return toast.error("Something went wrong.", {
        description: "Your sign up request failed. Please try again.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email">
                Email
              </Label>
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
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("password")}
              />
              {form.formState.errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
              <Link 
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}