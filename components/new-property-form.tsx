"use client"
  
import { useActionState } from "react";
import { newPropertySchema } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { states } from "@/lib/consts";
import countryList from "country-list";
import { createListing } from "@/lib/actions/listings";

type FormData = z.infer<typeof newPropertySchema>;

export default function NewPropertyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(newPropertySchema),
  });

  const countries = countryList.getNames();

  const [, action, pending] = useActionState(createListing, null);

  return (
    <div className="mt-6">
      <Form {...form}>
        <form action={action}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="nickname">
                Property name
              </Label>
              <Input
                id="firstName"
                type="text"
                autoCapitalize="none"
                autoComplete="firstName"
                autoCorrect="off"
                disabled={pending}
                {...form.register("nickname")}
              />
              {form.formState.errors?.nickname && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.nickname.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label className="" htmlFor="streetAddress">
                Street address
              </Label>
              <Input
                id="streetAddress"
                type="text"
                autoCapitalize="none"
                autoComplete="streetAddress"
                autoCorrect="off"
                disabled={pending}
                {...form.register("streetAddress")}
              />
              {form.formState.errors?.streetAddress && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.streetAddress.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label className="" htmlFor="streetAddress2">
                Street address line 2
              </Label>
              <Input
                id="streetAddress2"
                type="text"
                autoCapitalize="none"
                autoComplete="streetAddress"
                autoCorrect="off"
                disabled={pending}
                {...form.register("streetAddress2")}
              />
              {form.formState.errors?.streetAddress2 && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.streetAddress2.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">City</Label>
              <Input
                id="city"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={pending}
                {...form.register("city")}
              />
              {form.formState.errors?.city && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <FormField 
                control={form.control} 
                name="state" 
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name={field.name} value={field.value ?? ""} />
                  </FormItem>
              )} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Zip code</Label>
              <Input
                id="zip"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={pending}
                {...form.register("zip")}
              />
              {form.formState.errors?.zip && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.zip.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <FormField 
                control={form.control} 
                name="country" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name={field.name} value={field.value ?? ""} />
                  </FormItem>
              )} />
            </div>
          </div>
          <div className="mt-4">
            <Button className={cn(buttonVariants(), "hover:cursor-pointer")} disabled={pending}>
              {pending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save property
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}