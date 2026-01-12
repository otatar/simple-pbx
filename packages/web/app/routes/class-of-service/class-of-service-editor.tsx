import { zodResolver } from "@hookform/resolvers/zod";
import type { ClassOfService } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Form, Link } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useDelayedIsPending } from "~/utils/misc";

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  cos: z.coerce.number().min(0, "Class of Service is required"),
});

export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

export default function ClassOfServiceEditor({
  cos,
  onDelete,
}: {
  cos?: ClassOfService;
  onDelete?: (id: number) => void;
}) {
  const form = useRemixForm({
    mode: "onSubmit",
    resolver,
    submitConfig: {
      method: cos ? "PUT" : "POST",
    },
  });
  // Reset form values when cos changes (react-hook-form does not reset automatically)
  // This is useful when editing an existing cos
  useEffect(() => {
    form.reset({
      id: cos?.id ?? undefined,
      name: cos?.name ?? "",
      cos: cos?.cos ?? undefined,
    });
  }, [cos]);
  const isSubmitting = useDelayedIsPending();
  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit}>
        <div className="w-full space-y-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>ID:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled className="bg-gray-100" />
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
            name="cos"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Class of Service:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={0} step={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {cos ? "Update" : "Create"}
            </Button>
            {!cos ? (
              <Link to=".." relative="path">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  if (onDelete && cos) {
                    onDelete(cos.id);
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </Form>
    </RemixFormProvider>
  );
}
