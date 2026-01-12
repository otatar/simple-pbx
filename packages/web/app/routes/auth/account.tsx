import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AccountEditor, { resolver, type FormData } from "./account-editor";
import PasswordChangeEditor, {
  resolverPassword,
  type FormDataPassword,
} from "./password-change-editor";
import type { Route } from "./+types/account";
import { auth } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { invariantResponse } from "@epic-web/invariant";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });
  const user = await db.user.findUnique({ where: { id: session?.user.id } });
  invariantResponse(user, "User not found", { status: 404 });
  return user;
}

export async function action({ request }: Route.LoaderArgs) {
  if (request.method === "POST") {
    const session = await auth.api.getSession({ headers: request.headers });
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormData>(request, resolver);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    await db.user.update({
      where: { id: session?.user.id },
      data: {
        name: receivedData.name,
      },
    });
    return redirectWithToast("/", {
      type: "success",
      title: "Success",
      description: "Account updated successfully",
    });
  } else if (request.method === "PATCH") {
    // Handle password change action here if needed
    const session = await auth.api.getSession({ headers: request.headers });
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormDataPassword>(request, resolverPassword);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    try {
      await auth.api.changePassword({
        body: {
          newPassword: receivedData.password,
          currentPassword: receivedData.oldPassword,
          revokeOtherSessions: true,
        },
        headers: request.headers,
      });
    } catch (error) {
      return badRequest({
        errors: { formError: "Current password is incorrect" },
        defaultValues,
      });
    }
    return redirectWithToast("/", {
      type: "success",
      title: "Success",
      description: "Password updated successfully",
    });
  }
}

export default function AccountPage({ loaderData, actionData }: Route.ComponentProps) {
  const error =
    actionData?.errors && "formError" in actionData.errors
      ? actionData.errors.formError
      : undefined;
  return (
    <Dialog open={true}>
      <DialogContent
        className="min-w-1/3 [&>button:last-child]:hidden"
        aria-describedby={undefined}
      >
        <DialogTitle></DialogTitle>
        {loaderData ? (
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="basic">Account details</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <AccountEditor user={loaderData} />
            </TabsContent>
            <TabsContent value="password">
              <PasswordChangeEditor user={loaderData} error={error} />
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
