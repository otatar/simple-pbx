import { getValidatedFormData } from "remix-hook-form";

import ExtensionEditor from "./extension-editor";
import { resolver, type FormData } from "./extension-editor";
import type { Route } from "./+types/extension-new";
import { badRequest } from "~/utils/request.server";
import { checkExtension, createExtension } from "~/models/extensions.server";
import { redirectWithToast } from "~/utils/toast.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { getCos } from "~/models/class-of-service.server";

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: receivedData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    return badRequest({ errors, defaultValues });
  }
  try {
    const existingExtension = await checkExtension(receivedData.extension);
    if (existingExtension) {
      return badRequest({
        errors: {
          extension: "Extension already exists",
        },
        defaultValues: receivedData,
      });
    }
    await createExtension(receivedData);
    return redirectWithToast("/extensions", {
      type: "success",
      title: "Success",
      description: "Extension created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export async function loader() {
  return await getCos();
}

export default function NewExtension({ loaderData }: Route.ComponentProps) {
  return <ExtensionEditor coss={loaderData} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
