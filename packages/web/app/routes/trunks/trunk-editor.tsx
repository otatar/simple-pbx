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
import { ChevronsDown, ChevronsUp, Loader2, Terminal } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { NumberManipulation, ps_endpoints, Trunk } from "@prisma/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import NumberManipulationTable from "./num-man-table";

const codecs = [
  "alaw",
  "ulaw",
  "g722",
  "gsm",
  "g729",
  "h261",
  "h263",
  "263p",
  "h264",
  "vp8",
  "vp9",
] as const;
export type Codec = (typeof codecs)[number];
const dtmfModes = ["rfc4733", "inband", "info", "auto"] as const;
const directMediaMethods = ["invite", "reinvite", "update"] as const;
const yesNoOptions = ["yes", "no", "true", "false", "on", "off"] as const;
const yesOrNo = ["yes", "no"] as const;
const languages = ["en"] as const;
export type Language = (typeof languages)[number];
const numberManipulationHeaders = [
  { title: "ID", value: "id" },
  { title: "Priority", value: "priority" },
  { title: "Name", value: "name" },
  { title: "Match", value: "match" },
  { title: "Strip Begin", value: "stripBegin" },
  { title: "Strip End", value: "stripEnd" },
  { title: "Prepend", value: "prepend" },
  { title: "Append", value: "append" },
];

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  provider: z.string().optional(),
  host: z.string().min(1, "Host is required"),
  port: z.number({ required_error: "Port is required" }).min(0),
  username: z.string().optional(),
  password: z.string().optional(),
  max_audio_streams: z.coerce
    .number()
    .min(0, "Max audio streams is required")
    .optional(),
  max_video_streams: z.coerce
    .number()
    .min(0, "Max video streams is required")
    .optional(),
  registration: z.enum(yesOrNo),
  serverUri: z.string().optional(),
  clientUri: z.string().optional(),
  transport: z.string().optional(),
  codec_1: z.enum(codecs).optional(),
  codec_2: z.enum(codecs).optional(),
  codec_3: z.enum(codecs).optional(),
  codec_4: z.enum(codecs).optional(),
  qualifyFrequency: z.coerce.number().min(1).optional(),
  dtmf_mode: z.enum(dtmfModes).optional(),
  direct_media: z.enum(["yes", "no", "true", "false", "on", "off"]).optional(),
  direct_media_method: z.enum(directMediaMethods).optional(),
  ice_support: z.enum(yesNoOptions).optional(),
  rewrite_contact: z.enum(yesNoOptions).optional(),
  webrtc: z.enum(yesNoOptions).optional(),
  send_diversion: z.enum(yesNoOptions).optional(),
  send_pai: z.enum(yesNoOptions).optional(),
  send_rpid: z.enum(yesNoOptions).optional(),
});

export type FormData = z.infer<typeof schema>;
export const resolver = zodResolver(schema);

type TrunkEditorProps = {
  trunk?: Trunk &
    Omit<ps_endpoints, "id"> & {
      codec_1: string;
      codec_2: string;
      codec_3: string;
      codec_4: string;
    };
  numberManipulations?: NumberManipulation[];
};

export default function TrunkEditor({
  trunk,
  numberManipulations,
}: TrunkEditorProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isOutNumManOpen, setIsOutNumManOpen] = useState(false);

  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: trunk?.id ?? undefined,
      name: trunk?.name ?? "",
      provider: trunk?.provider ?? "",
      host: trunk?.host ?? "",
      port: trunk?.port ?? 5060,
      username: trunk?.username ?? "",
      password: trunk?.password ?? "",
      max_audio_streams: trunk?.max_audio_streams ?? 1,
      max_video_streams: trunk?.max_video_streams ?? 0,
      registration: trunk?.registration ?? "no",
      serverUri: trunk?.serverUri ?? "",
      clientUri: trunk?.clientUri ?? "",
      transport: trunk?.transport ?? "transport-udp",
      codec_1: (trunk?.codec_1 as Codec) ?? "alaw",
      codec_2: (trunk?.codec_2 as Codec) ?? "ulaw",
      codec_3: (trunk?.codec_3 as Codec) ?? "g722",
      codec_4: (trunk?.codec_4 as Codec) ?? "gsm",
      qualifyFrequency: trunk?.qualifyFrequency ?? 60,
      dtmf_mode: trunk?.dtmf_mode ?? "auto",
      direct_media: trunk?.direct_media ?? "no",
      direct_media_method: trunk?.direct_media_method ?? "invite",
      ice_support: trunk?.ice_support ?? "no",
      rewrite_contact: trunk?.rewrite_contact ?? "no",
      webrtc: trunk?.webrtc ?? "no",
      send_diversion: trunk?.send_diversion ?? "no",
      send_pai: trunk?.send_pai ?? "yes",
      send_rpid: trunk?.send_rpid ?? "yes",
    },
    submitConfig: {
      method: trunk ? "PUT" : "POST",
    },
  });
  const isRegistration = form.watch("registration");
  const isSubmitting = useDelayedIsPending();

  return (
    <>
      {trunk ? (
        <Title title="Update trunk" text="Here you can update trunk data!" />
      ) : (
        <Title title="Create trunk" text="Here you can create a new trunk!" />
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
                name="provider"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Provider:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Host:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Port:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Username:</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registration"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Registration:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serverUri"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Server URI:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isRegistration === "no"}
                        className={isRegistration === "no" ? "bg-gray-100" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientUri"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Client URI:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isRegistration === "no"}
                        className={isRegistration === "no" ? "bg-gray-100" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_audio_streams"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Audio Channels:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_video_streams"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Video Channels:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" size="sm">
                Advanced
                {isAdvancedOpen ? (
                  <ChevronsUp className="h-4 w-4" />
                ) : (
                  <ChevronsDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="grid grid-cols-1 md:grid-cols-2 justify-items-start gap-2 gap-x-6 mt-3">
              <FormField
                control={form.control}
                name="transport"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Transport:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="transport-udp">UDP</SelectItem>
                        <SelectItem value="transport-tcp">TCP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qualifyFrequency"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>SIP Options:</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dtmf_mode"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>DTMF Mode:</FormLabel>
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
                        {dtmfModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
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
                name="codec_1"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Codec 1:</FormLabel>
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
                        {codecs.map((codec) => (
                          <SelectItem key={codec} value={codec}>
                            {codec.toUpperCase()}
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
                name="codec_2"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Codec 2:</FormLabel>
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
                        {codecs.map((codec) => (
                          <SelectItem key={codec} value={codec}>
                            {codec.toUpperCase()}
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
                name="codec_3"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Codec 3:</FormLabel>
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
                        {codecs.map((codec) => (
                          <SelectItem key={codec} value={codec}>
                            {codec.toUpperCase()}
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
                name="codec_4"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Codec 4:</FormLabel>
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
                        {codecs.map((codec) => (
                          <SelectItem key={codec} value={codec}>
                            {codec.toUpperCase()}
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
                name="direct_media"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Direct Media:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direct_media_method"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Direct Media Method:</FormLabel>
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
                        {directMediaMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
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
                name="ice_support"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Ice Support:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rewrite_contact"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Rewrite Contact:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webrtc"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>WebRTC:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="send_diversion"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Ice Send Diversion:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="send_pai"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Send PAI:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="send_rpid"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Send RPID:</FormLabel>
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
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center justify-start space-x-2 w-full border-t pt-2 mt-4">
            <Button type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {trunk ? "Update" : "Create"}
            </Button>
            <Link to=".." relative="path">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </Form>
      </RemixFormProvider>
      {trunk ? (
        <>
          <Separator className="my-4" />
          <Collapsible open={isOutNumManOpen} onOpenChange={setIsOutNumManOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" size="sm">
                Outbound number manipulation
                {isOutNumManOpen ? (
                  <ChevronsUp className="h-4 w-4" />
                ) : (
                  <ChevronsDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <NumberManipulationTable
                manipulationData={numberManipulations ?? []}
                headers={numberManipulationHeaders}
              />
            </CollapsibleContent>
          </Collapsible>
        </>
      ) : null}
    </>
  );
}

function Title({ title, text }: { title: string; text: string }) {
  return (
    <Alert className="px-1 mb-2">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
}
