import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Eye, EyeOff, GalleryVerticalEnd, Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { data, Form } from "react-router";
import { getValidatedFormData, RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useDelayedIsPending } from "~/utils/misc";
import { badRequest } from "~/utils/request.server";
import { auth } from "~/utils/auth.server";
import { combineHeaders, getToast, redirectWithToast } from "~/utils/toast.server";
import { Alert, AlertTitle } from "~/components/ui/alert";
import type { Route } from "./+types/login";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Switch } from "~/components/ui/switch";
import { Toaster } from "~/components/toaster";

const schema = z.object({
  email: z.string().min(1, "Email is required").email({ message: "Valid email address required" }),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export async function loader({ request }: Route.LoaderArgs) {
  //Get toast from session
  const { toast, headers: toastHeaders } = await getToast(request);
  return data({ toast }, { headers: combineHeaders(toastHeaders) });
}

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: receivedData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    return badRequest({ errors, defaultValues });
  }

  const response = await auth.api.signInEmail({
    body: receivedData,
    headers: request.headers,
    asResponse: true,
  });
  if (response.ok) {
    return redirectWithToast(
      "/",
      {
        type: "success",
        title: "Success",
        description: "Logged in successfully",
      },
      { headers: response.headers }
    );
  } else {
    console.error("Response details:", response);
    if (response.status === 401) {
      return badRequest({
        errors: { formError: "Invalid email or password" },
        defaultValues,
      });
    }
  }
}

export default function LoginPage({ actionData, loaderData }: Route.ComponentProps) {
  const { toast } = loaderData;
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver,
    submitConfig: {
      method: "post",
    },
    stringifyAllValues: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const changeShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const isSubmitting = useDelayedIsPending();

  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <Phone className="size-4" />
              </div>
              SimplePBX
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <RemixFormProvider {...form}>
                <Form onSubmit={form.handleSubmit} className="flex flex-col gap-6" method="post">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter your email below to login to your account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-3 justify-items-start gap-2">
                          <FormLabel>E-mail:</FormLabel>
                          <div className="col-span-2">
                            <FormControl>
                              <Input className="mb-1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-3 justify-items-start gap-2">
                          <FormLabel>Password:</FormLabel>
                          <div className="col-span-2">
                            <FormControl>
                              <Input
                                className="mb-1"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Label className="text-sm font-medium">Show password:</Label>
                      <Switch checked={showPassword} onCheckedChange={changeShowPassword} />
                    </div>
                    <Button type="submit" className="w-full">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Login
                    </Button>
                  </div>
                </Form>
              </RemixFormProvider>
              {actionData?.errors && "formError" in actionData.errors ? (
                <Alert variant="destructive" className="mt-4 flex justify-center gap-2">
                  <AlertCircleIcon />
                  <AlertTitle>{actionData.errors.formError}</AlertTitle>
                </Alert>
              ) : null}
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
      <Toaster toast={toast} />
    </div>
  );
}
