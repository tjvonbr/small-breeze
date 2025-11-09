"use client"

import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { inviteMemberSchema } from "@/lib/validations";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TeamRole } from "@/generated/prisma";
import { Label } from "./ui/label";

type InviteMemberFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof inviteMemberSchema>;

export default function InviteMemberButton({ className, ...props }: InviteMemberFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(inviteMemberSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    console.log(data);
    setIsLoading(true);

    const response = await fetch("/api/invites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setIsLoading(false);
      
      return toast.error("Something went wrong.", {
        description: "Your invite request failed. Please try again.",
      });
    }

    try {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(buttonVariants(), "w-38 hover:cursor-pointer")}>
          <Icons.plus color="white" className="h-4 w-4" />
          <p className="text-white">Invite member</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Enter the email of the team member you want to invite!
          </DialogDescription>
        </DialogHeader>
        <div className={cn("grid gap-6", className)} {...props}>
          <Form {...form}>
            <form id="invite-member-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
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
                <FormField 
                control={form.control} 
                name="role" 
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TeamRole).map((role) => (
                          <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name={field.name} value={field.value ?? ""} />
                  </FormItem>
              )} />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="submit" form="invite-member-form" disabled={isLoading}>
            {isLoading ? "Inviting..." : "Invite"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}