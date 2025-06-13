import { createId as cuid } from "@paralleldrive/cuid2";
import { createCookieSessionStorage, redirect } from "react-router";
import { z } from "zod";

export const toastKey = "toast";

const TypeSchema = z.enum(["message", "info", "success", "warning", "error"]);
const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => cuid()),
  title: z.string().optional(),
  type: TypeSchema.default("message"),
});

export type Toast = z.infer<typeof ToastSchema>;
export type OptionalToast = Omit<Toast, "id" | "type"> & {
  id?: string;
  type?: z.infer<typeof TypeSchema>;
};

const secrets = process.env.SESSION_SECRET || "";
export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "en_toast",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: secrets.split(","),
    secure: process.env.NODE_ENV === "production",
  },
});

export async function redirectWithToast(
  url: string,
  toast: OptionalToast,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
  });
}

export async function createToastHeaders(optionalToast: OptionalToast) {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(optionalToast);
  session.flash(toastKey, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ "set-cookie": cookie });
}

export async function getToast(request: Request) {
  const session = await toastSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const result = ToastSchema.safeParse(session.get(toastKey));

  const toast = result.success ? result.data : null;
  const headers = toast
    ? new Headers({
        "set-cookie": await toastSessionStorage.destroySession(session),
      })
    : null;
  return {
    toast,
    headers: toast ? headers : null,
  };
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: Array<ResponseInit["headers"] | null | undefined>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}
