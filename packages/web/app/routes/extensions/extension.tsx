import {
  deleteExtension,
  getExtension,
  updateExtension,
} from "~/models/extensions.server";
import type { Route } from "./+types/extension";
import { redirectWithToast } from "~/utils/toast.server";
import { invariantResponse } from "@epic-web/invariant";
import { badRequest } from "~/utils/request.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import ExtensionEditor, { resolver, type FormData } from "./extension-editor";
import { getValidatedFormData } from "remix-hook-form";
import { getCos } from "~/models/class-of-service.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const id = parseInt(params.id);
  const extension = await getExtension(id);
  invariantResponse(extension, "Extension not found", { status: 404 });
  const coss = await getCos();
  return { extension, coss };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method == "DELETE") {
    invariantResponse(params.id, "ID is required");
    const id = parseInt(params.id);
    await deleteExtension(id);
    return redirectWithToast("/extensions", {
      type: "success",
      title: "Success",
      description: "Extension deleted successfully",
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
    await updateExtension(receivedData);
    return redirectWithToast("/extensions", {
      type: "success",
      title: "Success",
      description: "Extension updated successfully",
    });
  }
}

export default function Extension({ loaderData }: Route.ComponentProps) {
  return (
    <ExtensionEditor extension={loaderData.extension} coss={loaderData.coss} />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
