import { getValidatedFormData } from "remix-hook-form";

import TrunkEditor, { resolver, type FormData } from "./trunk-editor";
import type { Route } from "./+types/trunk-new";
import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { checkTrunk, createTrunk } from "~/models/trunks.server";

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
    const existingTrunk = await checkTrunk(receivedData.name);
    if (existingTrunk) {
      return badRequest({
        errors: {
          extension: "Trunk already exists",
        },
        defaultValues: receivedData,
      });
    }
    await createTrunk(receivedData);
    return redirectWithToast("/trunks", {
      type: "success",
      title: "Success",
      description: "Trunk created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewExtension({ loaderData }: Route.ComponentProps) {
  return <TrunkEditor />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
