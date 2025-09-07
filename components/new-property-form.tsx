"use client"

import { useState } from "react";
import { newPropertySchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { states } from "@/lib/consts";
import countryList, { getCode } from "country-list";
import { createListing } from "@/lib/actions/listings";

type FormData = z.infer<typeof newPropertySchema>;

interface NewPropertyFormProps {
  userId: string;
}

export default function NewPropertyForm({ userId }: NewPropertyFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(newPropertySchema),
  });

  const countries = countryList.getNames();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      setIsLoading(false);

      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("streetAddress", data.streetAddress);
      formData.append("streetAddress2", data.streetAddress2 ?? "");
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("zip", data.zip);
      formData.append("country", getCode(data.country) ?? "");
      formData.append("calendarLink", data.calendarLink ?? "");
  
      const result = await createListing(formData, userId);

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
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="" htmlFor="firstName">
                Property name
              </Label>
              <Input
                id="firstName"
                type="text"
                autoCapitalize="none"
                autoComplete="firstName"
                autoCorrect="off"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                    <Select onValueChange={field.onChange}>
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
                disabled={isLoading}
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
                    <Select onValueChange={field.onChange}>
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
                  </FormItem>
              )} />
            </div>
          </div>
          <div className="mt-4">
            <Button className={cn(buttonVariants(), "hover:cursor-pointer")} disabled={isLoading}>
              {isLoading && (
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