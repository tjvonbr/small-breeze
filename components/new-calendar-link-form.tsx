"use client"

import { createCalendarLink } from "@/lib/actions/calendar-links";
import { newCalendarLinkSchema } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "./ui/form";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

interface NewCalendarLinkFormProps {
  listingId: string;
}

type FormData = z.infer<typeof newCalendarLinkSchema>;

export default function NewCalendarLinkForm({ listingId }: NewCalendarLinkFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(newCalendarLinkSchema),
  });

  const [, action, pending] = useActionState(createCalendarLink, null);
  
  return (
    <div>
      <Form {...form}>
        <form action={action} className="grid gap-2">
          <Label htmlFor="url">Add iCal URL</Label>
          <div className="flex gap-2">
            <Input
              id="url"
              type="text"
              autoCapitalize="none"
              autoComplete="url"
              autoCorrect="off"
              disabled={pending}
              {...form.register("url")}
            />
            {form.formState.errors?.url && (
              <p className="px-1 text-xs text-red-600">
                {form.formState.errors.url.message}
              </p>
            )}
            <input type="hidden" name="listingId" value={listingId} />
            <Button className={cn(buttonVariants(), "hover:cursor-pointer")} disabled={pending}>
              {pending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add
            </Button>
          </div>  
        </form>
      </Form>
    </div>
  )
}