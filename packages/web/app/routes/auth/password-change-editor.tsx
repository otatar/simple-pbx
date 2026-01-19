import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "~/prisma/client";
import { AlertCircleIcon, Loader2, Terminal } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useDelayedIsPending } from "~/utils/misc";
import type { Route } from "./+types/account";

export const schema = z
  .object({
    id: z.optional(z.string()),
    email: z.optional(z.string()),
    oldPassword: z.string().min(1, "Old password is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        new RegExp("(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{6,}$)"),
        "Minimum length is six characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    retypePassword: z.string(),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords don't match",
    path: ["retypePassword"],
  });

export type FormDataPassword = z.infer<typeof schema>;
export const resolverPassword = zodResolver(schema);

export default function PasswordChangeEditor({ user, error }: { user: User; error?: string }) {
  const form = useRemixForm<FormDataPassword>({
    mode: "onSubmit",
    resolver: resolverPassword,
    defaultValues: {
      id: user?.id ?? "",
      email: user?.email ?? "",
      oldPassword: "",
      password: "",
      retypePassword: "",
    },
    submitConfig: {
      method: "PATCH",
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
      <Title title="Change password" text="Here you can change password for account" />

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
                  <Input {...field} disabled className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Old Password:</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="retypePassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Retype New Password:</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex mt-4 border-t">
            <div className="flex items-center justify-start space-x-2 w-full pt-2">
              <Button type="submit">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Change
              </Button>
              <Link to=".." relative="path">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-start space-x-2 w-full mt-2">
              <Label>Show passwords:</Label>
              <Switch
                checked={showPassword}
                onCheckedChange={changeShowPassword}
                className="ml-2"
              />
            </div>
          </div>
          {error ? (
            <Alert variant="destructive" className="mt-4 flex justify-center gap-2">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          ) : null}
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
