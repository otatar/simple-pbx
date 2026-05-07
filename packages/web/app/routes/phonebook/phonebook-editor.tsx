import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRemixForm, RemixFormProvider } from "remix-hook-form";

import { Form, Link } from "react-router";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useDelayedIsPending } from "~/utils/misc";
import { Loader2, Terminal } from "lucide-react";
import type { ExternalPhonebook } from "~/prisma/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const contactTypeOptions = ["mobile", "landline", "satellite"] as const;

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  contactType: z.enum(contactTypeOptions),
});

export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

type PhonebookEditorProps = {
  entry?: ExternalPhonebook;
};

export default function PhonebookEditor({ entry }: PhonebookEditorProps) {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: entry?.id ?? undefined,
      name: entry?.name ?? "",
      phoneNumber: entry?.phoneNumber ?? "",
      email: entry?.email ?? "",
      company: entry?.company ?? "",
      notes: entry?.notes ?? "",
      contactType: entry?.contactType ?? "mobile",
    },
    submitConfig: {
      method: entry ? "PUT" : "POST",
    },
  });
  const isSubmitting = useDelayedIsPending();

  return (
    <>
      {entry ? (
        <Title title="Update contact" text="Here you can update contact data!" />
      ) : (
        <Title title="Create contact" text="Here you can create a new external contact!" />
      )}
      <RemixFormProvider {...form}>
        <Form onSubmit={form.handleSubmit}>
          <div className="flex flex-col justify-center gap-2">
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>ID:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled
                        className="bg-gray-100"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Phone Number:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactType"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Contact Type:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Company:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Notes:</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {entry ? "Update" : "Create"}
            </Button>
            <Link to=".." relative="path">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </Form>
      </RemixFormProvider>
    </>
  );
}

export function Title({ title, text }: { title: string; text: string }) {
  return (
    <Alert className="px-1">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
