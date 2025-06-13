import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ClassOfService,
  OutgoingRoute,
  Trunk,
  TrunkGroup,
} from "@prisma/client";
import { Loader2, Terminal } from "lucide-react";
import { Form, Link } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDelayedIsPending } from "~/utils/misc";

const destinationTypes = ["trunk", "trunkGroup", "extension", "queue"] as const;

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  prefix: z
    .string()
    .min(1, "Prefix is required")
    .regex(/^(\d*)([xX]*)$/, "Prefix must be digits or 'x'"),
  destinationType: z.enum(destinationTypes, {
    required_error: "Destination type is required",
  }),
  trunkId: z.coerce.number().optional(),
  trunkGroupId: z.coerce.number().optional(),
  cosId: z.coerce.number(),
});
export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

interface OutboundRouteEditorProps {
  route?: OutgoingRoute;
  trunks: Trunk[];
  trunkGroups: TrunkGroup[];
  coss: ClassOfService[];
}

export default function OutboundRouteEditor(props: OutboundRouteEditorProps) {
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: props.route?.id ?? undefined,
      name: props.route?.name ?? "",
      prefix: props.route?.prefix ?? "",
      destinationType: props.route?.destinationType ?? "trunk",
      trunkId: props.route?.trunkId ?? undefined,
      trunkGroupId: props.route?.trunkGroupId ?? undefined,
      cosId: props.route?.cosId ?? undefined,
    },
    submitConfig: {
      method: props.route ? "PUT" : "POST",
    },
  });
  const isSubmitting = useDelayedIsPending();

  return (
    <>
      {props.route ? (
        <Title
          title="Update outbound route"
          text="Here you can update route data!"
        />
      ) : (
        <Title
          title="Create outbound route"
          text="Here you can create a outbound route!"
        />
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
                name="prefix"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Prefix:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationType"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Destination Type:</FormLabel>
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
                        {destinationTypes.map((dt) => (
                          <SelectItem key={dt} value={dt}>
                            {dt}
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
                name="trunkId"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Trunk:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.trunks.map((trunk) => (
                          <SelectItem
                            key={trunk.id}
                            value={trunk.id.toString()}
                          >
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
                name="trunkGroupId"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Trunk Group:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.trunkGroups.map((tg) => (
                          <SelectItem key={tg.id} value={tg.id.toString()}>
                            {tg.name}
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
                name="cosId"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Class of Service:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.coss.map((cos) => (
                          <SelectItem key={cos.id} value={cos.id.toString()}>
                            {cos.cos}|{cos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {props.route ? "Update" : "Create"}
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

function Title({ title, text }: { title: string; text: string }) {
  return (
    <Alert className="px-1">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
