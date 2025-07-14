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
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { useState } from "react";
import { useDelayedIsPending } from "~/utils/misc";
import { Eye, EyeOff, Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { WebUser } from "@prisma/client";

const roles = ["user", "admin"] as const;

export const schema = z.object({
  id: z.optional(z.number()),
  email: z.string().email("Valid email address required"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      new RegExp("(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{6,}$)"),
      "Minimum length is six characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
  role: z.enum(roles),
  active: z.coerce.boolean(),
});
export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

export default function UserEditor({ user }: { user?: WebUser }) {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: user?.id ?? undefined,
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      password: user ? "Test.01" : "",
      role: user?.role ?? "user",
      active: user?.active ?? true,
    },
    submitConfig: {
      method: user ? "PUT" : "POST",
    },
    stringifyAllValues: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const changeShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const isSubmitting = useDelayedIsPending();

  return (
    <>
      {user ? (
        <Title title="Update user" text="Here you can update user data!" />
      ) : (
        <Title title="Create user" text="Here you can create a new user!" />
      )}
      <RemixFormProvider {...form}>
        <Form onSubmit={form.handleSubmit} className="space-y-2 mt-2" method="post">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>ID:</FormLabel>
                <FormControl>
                  <Input {...field} disabled type="number" className="bg-gray-100" />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!user ? (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input type={showPassword ? "text" : "password"} {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={changeShowPassword}
                      >
                        {showPassword ? (
                          <Eye className="text-blue-500" />
                        ) : (
                          <EyeOff className="text-blue-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>First Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Last Name:</FormLabel>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Active:</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {user ? "Update" : "Create"}
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
