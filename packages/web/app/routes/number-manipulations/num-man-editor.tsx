import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRemixForm, RemixFormProvider } from "remix-hook-form";

import { Form, Link } from "react-router";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useDelayedIsPending } from "~/utils/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { NumberManipulation, Trunk } from "@prisma/client";
import { Loader2 } from "lucide-react";

const numberManipulationTypes = [
  { value: "aNumber", title: "A Number" },
  { value: "bNumber", title: "B Number" },
];
const numberManipulationValues = ["aNumber", "bNumber"] as const;
const directionValues = ["inbound", "outbound"] as const;

export const schema = z.object({
  id: z.number().optional(),
  trunkId: z.number(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(numberManipulationValues, {
    required_error: "Type is required",
  }),
  direction: z.enum(directionValues, {
    required_error: "Direction is required",
  }),
  match: z.string().optional(),
  priority: z.coerce.number({ required_error: "Port is required" }).min(0),
  stripBegin: z.coerce
    .number()
    .min(0, "Strip cannot be less than 0")
    .optional(),
  stripEnd: z.coerce.number().min(0, "Strip cannot be less than 0").optional(),
  prepend: z.string().optional(),
  append: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

interface OutboundNumberManipulationEditorProps {
  numberManipulation?: NumberManipulation;
  trunks: Trunk[];
}

export default function OutboundNumberManipulationEditor({
  trunks,
  numberManipulation,
}: OutboundNumberManipulationEditorProps) {
  const form = useRemixForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: numberManipulation?.id ?? undefined,
      trunkId: numberManipulation?.trunkId ?? trunks[0]?.id,
      name: numberManipulation?.name ?? "",
      type: numberManipulation?.type ?? "aNumber",
      direction: numberManipulation?.direction ?? "outbound",
      match: numberManipulation?.match ?? "",
      priority: numberManipulation?.priority ?? 1,
      stripBegin: numberManipulation?.stripBegin ?? 0,
      stripEnd: numberManipulation?.stripEnd ?? 0,
      prepend: numberManipulation?.prepend ?? "",
      append: numberManipulation?.append ?? "",
    },
    submitConfig: {
      method: numberManipulation ? "PUT" : "POST",
    },
  });
  const isSubmitting = useDelayedIsPending();

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit} method="post">
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
            name="trunkId"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Trunk:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trunks.map((trunk) => (
                      <SelectItem key={trunk.name} value={trunk.id.toString()}>
                        {trunk.name}
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
            name="priority"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Priority:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Type:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {numberManipulationTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.title}
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
            name="direction"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Direction:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {directionValues.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
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
            name="match"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Match:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stripBegin"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Strip Begin:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stripEnd"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Strip End:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prepend"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Prepend:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="append"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                <FormLabel>Append:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {numberManipulation ? "Update" : "Create"}
            </Button>
            <Link to=".." relative="path">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </Form>
    </RemixFormProvider>
  );
}
