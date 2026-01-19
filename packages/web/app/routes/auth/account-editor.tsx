import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { useDelayedIsPending } from "~/utils/misc";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { User } from "~/prisma/client";

const roles = ["user", "admin"] as const;

export const schema = z.object({
  id: z.optional(z.string()),
  email: z.string().email("Valid email address required"),
  name: z.string().min(1, "Name is required"),
  role: z.string(),
});
export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

export default function AccountEditor({ user }: { user: User }) {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: user?.id ?? undefined,
      email: user?.email ?? "",
      name: user?.name ?? "",
      role: user?.role ?? "user",
    },
    stringifyAllValues: false,
  });

  const isSubmitting = useDelayedIsPending();

  return (
    <>
      <Title title="Account data" text="Here you can update account data!" />

      <RemixFormProvider {...form}>
        <Form onSubmit={form.handleSubmit} className="space-y-2 mt-2" method="post">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>ID:</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>E-mail:</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
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
            name="role"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Role:</FormLabel>
                <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update
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
