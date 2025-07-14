import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";
import { createUser, getUserByUsername } from "~/models/ users.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import UserEditor, { resolver, type FormData } from "./user-editor";
import { getValidatedFormData } from "remix-hook-form";
import type { Route } from "./+types";

export const action = async ({ request }: Route.ActionArgs) => {
  //await validateCSRF(request);
  const {
    errors,
    data: receivedData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    return badRequest({ errors, defaultValues });
  }
  //Check for user in database
  const user = await getUserByUsername(receivedData.email);
  if (user) {
    return badRequest({
      errors: {
        email: "User with that email already exists",
      },
      defaultValues,
    });
  }
  try {
    await createUser(receivedData);
    return redirectWithToast("/users", {
      type: "success",
      title: "Success",
      description: "User created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
};

export default function NewUser() {
  return <UserEditor />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
