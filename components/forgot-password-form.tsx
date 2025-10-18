"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validations";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { toast } from "sonner";
import authClient from "@/lib/auth-client";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/",
      })

      setIsLoading(false);
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
              <Input
                id="email"
                type="email"
                placeholder="Email"
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
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send password reset link
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}