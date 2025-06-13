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
import type { ClassOfService, Extension, ps_endpoints } from "@prisma/client";
import InputWithTwoButtons from "./input-with-two-buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

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

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  extension: z.string().min(1, "Extension is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      new RegExp(
        "(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.,_+=<>#?!@$%^&*-]).{6,}$)",
      ),
      "Minimum length is six characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
  cosId: z.coerce.number(),
  callRecord: z.enum(yesOrNo).optional(),
  phoneBook: z.enum(yesOrNo).optional(),
  language: z.enum(languages).optional(),
  transport: z.string().optional(),
  codec_1: z.enum(codecs).optional(),
  codec_2: z.enum(codecs).optional(),
  codec_3: z.enum(codecs).optional(),
  codec_4: z.enum(codecs).optional(),
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

type ExtensionEditorProps = {
  extension?: Extension &
    Omit<ps_endpoints, "id"> & {
      codec_1: string;
      codec_2: string;
      codec_3: string;
      codec_4: string;
    };
  coss: ClassOfService[];
};

export default function ExtensionEditor({
  extension,
  coss,
}: ExtensionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      id: extension?.id ?? undefined,
      name: extension?.name ?? "",
      extension: extension?.extension ?? "",
      password: extension?.password ?? "",
      email: extension?.email ?? "",
      transport: extension?.transport ?? "transport-udp",
      callRecord: extension?.callRecord ?? "no",
      phoneBook: extension?.phoneBook ?? "yes",
      language: (extension?.language as Language) ?? "en",
      cosId: extension?.cosId ?? undefined,
      codec_1: (extension?.codec_1 as Codec) ?? "alaw",
      codec_2: (extension?.codec_2 as Codec) ?? "ulaw",
      codec_3: (extension?.codec_3 as Codec) ?? "g722",
      codec_4: (extension?.codec_4 as Codec) ?? "gsm",
      dtmf_mode: extension?.dtmf_mode ?? "auto",
      direct_media: extension?.direct_media ?? "no",
      direct_media_method: extension?.direct_media_method ?? "invite",
      ice_support: extension?.ice_support ?? "no",
      rewrite_contact: extension?.rewrite_contact ?? "no",
      webrtc: extension?.webrtc ?? "no",
      send_diversion: extension?.send_diversion ?? "no",
      send_pai: extension?.send_pai ?? "yes",
      send_rpid: extension?.send_rpid ?? "yes",
    },
    submitConfig: {
      method: extension ? "PUT" : "POST",
    },
  });
  const isSubmitting = useDelayedIsPending();

  return (
    <>
      {extension ? (
        <Title
          title="Update extension"
          text="Here you can update extension data!"
        />
      ) : (
        <Title
          title="Create extension"
          text="Here you can create a new extension!"
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
                name="extension"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 justify-items-start gap-2">
                    <FormLabel>Extension:</FormLabel>
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
                    <FormLabel>SIP Password:</FormLabel>
                    <FormControl>
                      <InputWithTwoButtons {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" size="sm">
                Advanced
                {isOpen ? (
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
                        {coss.map((cos) => (
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
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Language:</FormLabel>
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
                        {languages.map((lan) => (
                          <SelectItem key={lan} value={lan}>
                            {lan}
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
              <FormField
                control={form.control}
                name="phoneBook"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Show in phonebook:</FormLabel>
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
                name="callRecord"
                render={({ field }) => (
                  <FormItem className="inline-form-item w-full">
                    <FormLabel>Record calls:</FormLabel>
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
              {extension ? "Update" : "Create"}
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
