import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Form, Link } from "react-router";
import { getValidatedFormData, RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { getGeneralSettings, updateGeneralSettings } from "~/models/settings-server";
import { useDelayedIsPending } from "~/utils/misc";
import type { Route } from "./+types/general";
import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";

const schema = z.object({
  id: z.number(),
  ringTimeout: z.coerce.number().min(0, "Ring timeout must be a positive number"),
  maxCallDuration: z.coerce.number().min(0, "Max call duration must be a positive number"),
  subBranding: z.optional(z.string()),
});

type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export async function loader() {
  return await getGeneralSettings();
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
  await updateGeneralSettings(receivedData);
  return redirectWithToast("/settings/general", {
    type: "success",
    title: "Success",
    description: "General settings updated successfully",
  });
}

export default function GeneralSettings({ loaderData }: Route.ComponentProps) {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: loaderData?.id,
      ringTimeout: loaderData?.ringTimeout ?? 40,
      maxCallDuration: loaderData?.maxCallDuration ?? 18000,
      subBranding: loaderData?.subBranding ?? "Let it simply ring!",
    },
    stringifyAllValues: false,
  });
  const isSubmitting = useDelayedIsPending();

  return (
    <div>
      <Title title="General Settings" text="Configure your PBX general settings." />
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
            name="ringTimeout"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Ring Timeout (sec):</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxCallDuration"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Max Call Duration (sec):</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subBranding"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Sub Brand:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update
            </Button>
            <Link to="..">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </Form>
      </RemixFormProvider>
    </div>
  );
}
