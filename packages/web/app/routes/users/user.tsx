import { invariantResponse } from "@epic-web/invariant";
import { getValidatedFormData } from "remix-hook-form";
import { changePassword, deleteUser, getUser, updateUser } from "~/models/ users.server";
import { redirectWithToast } from "~/utils/toast.server";
import UserEditor, { resolver, type FormData } from "./user-editor";
import { badRequest } from "~/utils/request.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import type { Route } from "./+types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PasswordEditor, { resolverPassword, type FormDataPassword } from "./password-editor";

export async function action({ request, params }: Route.LoaderArgs) {
  if (request.method == "DELETE") {
    invariantResponse(params.id, "ID is required");
    await deleteUser(params.id);
    return redirectWithToast("/users", {
      type: "success",
      title: "Success",
      description: "User deleted successfully",
    });
  } else if (request.method == "PUT") {
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormData>(request, resolver);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    await updateUser(receivedData);
    return redirectWithToast("/users", {
      type: "success",
      title: "Success",
      description: "User updated successfully",
    });
  } else if (request.method == "PATCH") {
    //We are using PATCH HTTP method for password change (not sure if it is good idea)
    invariantResponse(params.id, "ID is required");
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormDataPassword>(request, resolverPassword);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    await changePassword(Number(params.id), receivedData.password, true);
    return redirectWithToast("/users", {
      type: "success",
      title: "Success",
      description: "Password changed successfully",
    });
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const id = parseInt(params.id);
  const user = await getUser(id);
  invariantResponse(user, "User not found", { status: 404 });
  return user;
}

export default function User({ loaderData }: Route.ComponentProps) {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="basic">Details</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <UserEditor user={loaderData} />
      </TabsContent>
      <TabsContent value="password">
        <PasswordEditor user={loaderData} />
      </TabsContent>
    </Tabs>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
